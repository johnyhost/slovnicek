# Slovníček 🟩💬

Detská Android aplikácia na učenie anglických slovíčok (EN ↔ SK) v štýle Duolinga.
Ročníky 1–9, aktuálne obsahuje **3. ročník** (Starter + Unit 1–15) a **5. ročník** (kapitoly 1–6 + Vocabulary and Reading 4–6).

## Inštalácia do telefónu
1. V telefóne otvor **https://github.com/johnyhost/slovnicek/releases/latest/download/Slovnicek.apk**
2. Stiahnutý súbor otvor → povoľ „Inštalovať neznáme aplikácie“ pre prehliadač → **Inštalovať**.
3. Novú verziu nainštaluješ rovnako – nainštaluje sa cez starú a postup ostane.

Funguje od Androidu 5.0 (Samsung S10 bez problémov). Nepotrebuje internet.

## Čo aplikácia vie
- Profily podľa mena (viac detí na jednom telefóne), postup sa ukladá len v telefóne.
- Lekcie z učebnice ako mapa (Duolingo štýl), 1–3 hviezdičky za lekciu.
- Typy úloh: nové slovo, výber prekladu (SK→EN aj EN→SK), počúvanie (výslovnosť cez Android TTS),
  spájanie dvojíc, skladanie slova z písmen, písanie po anglicky.
- Tolerancia preklepov pri písaní: malá chyba = „Takmer! Malá chybička 😉 · Almost! Just a small mistake.“
- Za každých 5 správnych za sebou ❤️, odznaky (+2 ❤️), séria dní 🔥, XP a úrovne.
- Obchod: za ❤️ sa kupujú farebné témy a avatari.
- Opakovanie slabých slov a „Výzva 60 sekúnd“ s rekordom.

## Ako pridať / upraviť slovíčka
Všetky slová sú v `app/src/main/assets/www/words.js`. Každý ročník má zoznam `units`
(lekcií), každá lekcia má `words: [["english","slovensky"], ...]`.
Alternatívy oddeľ `|`, napr. `["rubber|eraser","guma"]`. **ID lekcie nemeň** – podľa neho sa ukladá postup.
Po pushnutí do `main` GitHub Actions automaticky postaví nové APK.

## Štruktúra
- `app/src/main/assets/www/` – samotná hra (HTML/CSS/JS, bez knižníc)
- `app/src/main/java/.../MainActivity.java` – WebView + most pre ukladanie, výslovnosť a vibrácie
- `keystore/slovnicek.p12` – podpisový kľúč (heslo `slovnicek`), aby sa aktualizácie dali inštalovať cez starú verziu
- `.github/workflows/build-apk.yml` – build a vydanie APK

Lokálny build: `./gradlew assembleRelease` (Android Studio / Android SDK, JDK 17).
