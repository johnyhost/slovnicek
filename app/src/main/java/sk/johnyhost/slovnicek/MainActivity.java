package sk.johnyhost.slovnicek;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.Context;
import android.content.SharedPreferences;
import android.graphics.Color;
import android.os.Build;
import android.os.Bundle;
import android.os.VibrationEffect;
import android.os.Vibrator;
import android.speech.tts.TextToSpeech;
import android.view.View;
import android.view.Window;
import android.view.WindowManager;
import android.webkit.JavascriptInterface;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;

import java.util.Locale;

/**
 * Thin native shell: a full-screen WebView that runs the game from assets/www,
 * plus a small JS bridge ("Native") for saving progress, text-to-speech, vibration
 * and status-bar colour. No external libraries, works from Android 5.0.
 */
public class MainActivity extends Activity {

    private static final String PREFS = "slovnicek";
    private static final String KEY_STATE = "state";

    private WebView web;
    private TextToSpeech tts;
    private volatile boolean ttsReady = false;
    private SharedPreferences prefs;

    @SuppressLint({"SetJavaScriptEnabled", "AddJavascriptInterface"})
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        prefs = getSharedPreferences(PREFS, Context.MODE_PRIVATE);
        setBars("#1b1446", false);

        web = new WebView(this);
        web.setBackgroundColor(Color.parseColor("#1b1446"));
        web.setOverScrollMode(View.OVER_SCROLL_NEVER);
        WebSettings s = web.getSettings();
        s.setJavaScriptEnabled(true);
        s.setDomStorageEnabled(true);
        s.setMediaPlaybackRequiresUserGesture(false);
        s.setTextZoom(100);
        s.setAllowFileAccess(true);
        web.setWebChromeClient(new WebChromeClient());
        web.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, String url) {
                return !url.startsWith("file:///android_asset/");
            }
        });
        web.addJavascriptInterface(new Bridge(), "Native");
        setContentView(web);
        web.loadUrl("file:///android_asset/www/index.html");

        tts = new TextToSpeech(this, new TextToSpeech.OnInitListener() {
            @Override
            public void onInit(int status) {
                if (status != TextToSpeech.SUCCESS) return;
                int r = tts.setLanguage(Locale.UK);
                if (r < 0) r = tts.setLanguage(Locale.US);
                if (r < 0) r = tts.setLanguage(Locale.ENGLISH);
                tts.setSpeechRate(0.9f);
                ttsReady = r >= 0;
            }
        });
    }

    private void setBars(final String hex, final boolean light) {
        if (Build.VERSION.SDK_INT < 21) return;
        Window w = getWindow();
        int c = Color.parseColor(hex);
        w.addFlags(WindowManager.LayoutParams.FLAG_DRAWS_SYSTEM_BAR_BACKGROUNDS);
        w.setStatusBarColor(c);
        w.setNavigationBarColor(c);
        if (Build.VERSION.SDK_INT >= 23) {
            int flags = w.getDecorView().getSystemUiVisibility();
            if (light) flags |= View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR;
            else flags &= ~View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR;
            w.getDecorView().setSystemUiVisibility(flags);
        }
    }

    @Override
    public void onBackPressed() {
        if (web == null) { super.onBackPressed(); return; }
        web.evaluateJavascript("(window.App && App.onBack) ? App.onBack() : false", new ValueCallback<String>() {
            @Override
            public void onReceiveValue(String value) {
                if (!"true".equals(value)) MainActivity.super.onBackPressed();
            }
        });
    }

    @Override
    protected void onPause() {
        super.onPause();
        if (tts != null) tts.stop();
    }

    @Override
    protected void onDestroy() {
        if (tts != null) { tts.stop(); tts.shutdown(); }
        if (web != null) { web.destroy(); }
        super.onDestroy();
    }

    /** Methods callable from JavaScript as window.Native.* */
    private class Bridge {
        @JavascriptInterface
        public String load() {
            return prefs.getString(KEY_STATE, null);
        }

        @JavascriptInterface
        public void save(String json) {
            prefs.edit().putString(KEY_STATE, json).apply();
        }

        @JavascriptInterface
        public boolean hasTts() {
            return ttsReady;
        }

        @JavascriptInterface
        public void speak(String text, String lang, boolean slow) {
            if (!ttsReady || text == null) return;
            if ("sk".equals(lang)) tts.setLanguage(new Locale("sk", "SK"));
            else if (tts.setLanguage(Locale.UK) < 0) tts.setLanguage(Locale.US);
            tts.setSpeechRate(slow ? 0.5f : 0.9f);
            if (Build.VERSION.SDK_INT >= 21) tts.speak(text, TextToSpeech.QUEUE_FLUSH, null, "w");
            else tts.speak(text, TextToSpeech.QUEUE_FLUSH, null);
        }

        @JavascriptInterface
        public void vibrate(int ms) {
            Vibrator v = (Vibrator) getSystemService(Context.VIBRATOR_SERVICE);
            if (v == null || !v.hasVibrator()) return;
            if (Build.VERSION.SDK_INT >= 26) v.vibrate(VibrationEffect.createOneShot(ms, VibrationEffect.DEFAULT_AMPLITUDE));
            else v.vibrate(ms);
        }

        @JavascriptInterface
        public void setBarColor(final String hex, final boolean light) {
            runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    try { setBars(hex, light); } catch (Exception ignored) { }
                }
            });
        }
    }
}
