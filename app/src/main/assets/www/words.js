/*
 * Slovníček – slovná zásoba (vocabulary)
 * -------------------------------------------------------------
 * grades  -> 9 ročníkov (1–9). Ročník bez lekcií je v aplikácii zamknutý ("Čoskoro").
 * units   -> lekcie v ročníku (jedna sada slov z učebnice).
 *   id      : stabilné ID (NEMENIŤ – podľa neho sa ukladá postup)
 *   tag     : krátky štítok z učebnice (napr. "Unit 3", "1A")
 *   title   : názov po slovensky,  en: názov po anglicky
 *   chapter : (voliteľné) kapitola – na mape sa zobrazí ako nadpis
 *   words   : ["english", "slovensky"]
 *             alternatívy oddeľ znakom |  napr. ["mum|mom", "mama"]
 *             (všetky alternatívy sa pri písaní uznajú, zobrazí sa prvá)
 */
window.SLOVNICEK_DATA = {
  version: 2,
  grades: [
    { grade: 1, units: [] },
    { grade: 2, units: [] },

    /* ======================= 3. ROČNÍK ======================= */
    { grade: 3, units: [
      { id: "g3-starter", tag: "Starter", title: "Ahoj!", en: "Hello!", icon: "👋", words: [
        ["blue","modrý"],["class","trieda"],["come","poď(te)"],["come on","poď(te), ponáhľaj(te) sa"],
        ["cousin","bratranec"],["eight","osem"],["everyone","všetci, každý"],["five","päť"],["four","štyri"],
        ["Friday","piatok"],["fun","zábava"],["goodbye","dovidenia"],["green","zelený"],["hello","ahoj"],
        ["hi","ahoj"],["Monday","pondelok"],["nine","deväť"],["one","jeden"],["orange","oranžový"],
        ["pink","ružový"],["purple","fialový"],["rainbow","dúha"],["red","červený"],["Saturday","sobota"],
        ["seven","sedem"],["sing","spievať"],["six","šesť"],["sorry","prepáčte"],["Sunday","nedeľa"],
        ["ten","desať"],["this","tento"],["three","tri"],["Thursday","štvrtok"],["too","tiež"],
        ["Tuesday","utorok"],["two","dva"],["Wednesday","streda"],["who","kto"],["yellow","žltá"]
      ]},
      { id: "g3-u1", tag: "Unit 1", title: "Školské veci", en: "School things", icon: "🎒", words: [
        ["apple","jablko"],["bag","taška"],["bird","vták"],["book","kniha"],["bookcase","knižnica (nábytok)"],
        ["cat","mačka"],["close","zavrieť"],["dog","pes"],["door","dvere"],["folder","zakladač"],["here","tu"],
        ["like","mať rád"],["look at","pozrieť na"],["OK","v poriadku"],["open","otvoriť"],["pen","pero"],
        ["pencil","ceruzka"],["pencil case","peračník"],["rubber|eraser","guma"],["ruler","pravítko"],
        ["school bag|schoolbag","školská taška"],["school things","školské veci"],["see","vidieť"],
        ["train","vlak"],["window","okno"]
      ]},
      { id: "g3-u2", tag: "Unit 2", title: "Hračky", en: "Toys", icon: "🧸", words: [
        ["animal","zviera"],["ball","lopta"],["big","veľký"],["bike","bicykel"],["car","auto"],["colour|color","farba"],
        ["doll","bábika"],["egg","vajce"],["favourite|favorite","obľúbený"],["fig","figa"],["game","hra"],["goat","koza"],
        ["hat","čiapka, klobúk"],["kite","šarkan"],["love","milovať"],["lovely","krásny"],["puzzle","puzzle, skladačka"],
        ["scooter","kolobežka"],["teddy","plyšový medvedík"],["toy","hračka"],["train","vlak"]
      ]},
      { id: "g3-u3", tag: "Unit 3", title: "Telo", en: "My body", icon: "🖐️", words: [
        ["all","všetko"],["arms","ruky, ramená"],["be a mess","byť špinavý, neupravený"],["body","telo"],
        ["colour|color","vyfarbiť"],["cut out","vystrihnúť"],["ears","uši"],["eyebrows","obočie"],["eyes","oči"],
        ["face","tvár"],["fingers","prsty"],["fold","zložiť, poskladať"],["hands","ruky"],["ink","atrament"],
        ["jam","džem"],["kite","šarkan"],["legs","nohy"],["let's learn","poďme sa učiť"],["lion","lev"],["long","dlhý"],
        ["make","urobiť"],["nose","nos"],["now","teraz"],["oops","uf!"],["paper","papier"],["paw","labka"],
        ["point to","ukázať na"],["put on","obliecť si"],["shoulders","plecia"],["stick","prilepiť"],["tail","chvost"],
        ["that's right|that is right","to je správne"],["then","potom"]
      ]},
      { id: "g3-u4", tag: "Unit 4", title: "Povolania", en: "Jobs", icon: "🚒", words: [
        ["again","znovu"],["brother","brat"],["doctor","doktor"],["eat","jesť"],["family","rodina"],["farmer","farmár"],
        ["fireman|firefighter","požiarnik"],["grandma","stará mama"],["grandpa","starý otec"],["happy","šťastný"],
        ["hero","hrdina"],["housewife","žena v domácnosti"],["kind","milý"],["lane","ulička"],["meat","mäso"],
        ["meet","stretnúť (sa)"],["mum|mom","mamička"],["nurse","(zdravotná) sestra"],["orange","pomaranč"],["pen","pero"],
        ["policeman","policajt"],["postman","poštár"],["pupil","žiak"],["teacher","učiteľ"],["uncle","ujo, strýko"],
        ["write","písať"],["zookeeper","ošetrovateľ zvierat v zoo"]
      ]},
      { id: "g3-u5", tag: "Unit 5", title: "Ihrisko", en: "Playground", icon: "⚽", words: [
        ["armbands","nafukovacie rukávniky"],["boy","chlapec"],["climbing frame","preliezačka"],["cool","chladný"],
        ["football","futbal"],["frisbee","frisbee, tanier na hádzanie"],["girl","dievča"],["goal","gól"],
        ["good try","dobrý pokus"],["help","pomôcť"],["ice cream","zmrzlina"],["in","v"],["net","bránka"],["nice","dobrý"],
        ["on","na"],["play","hrať sa"],["pool","bazén"],["queen","kráľovná"],["rabbit","králik"],["seesaw","hojdačka"],
        ["slide","šmýkačka"],["sofa","gauč"],["swing","hojdačka"],["teddy","plyšový medvedík"],["tree","strom"],
        ["umbrella","dáždnik"],["under","pod"],["where","kde"]
      ]},
      { id: "g3-u6", tag: "Unit 6", title: "Rodina", en: "Family", icon: "👪", words: [
        ["at","v"],["aunt","teta"],["box","škatuľa"],["brother","brat"],["cousin","bratranec, sesternica"],["dad","ocko"],
        ["find","nájsť"],["grandma","stará mama"],["grandpa","starý otec"],["into","do"],["know","vedieť"],
        ["look out of","pozerať (sa) z"],["lots of","veľa"],["love","láska"],["mum|mom","mama"],["photo","fotka"],
        ["sister","sestra"],["still","stále"],["the others","ostatní"],["they","oni"],["throw","hodiť, hádzať"],
        ["uncle","ujo, strýko"],["van","dodávka"],["window","okno"],["yo-yo|yoyo","jojo"]
      ]},
      { id: "g3-u7", tag: "Unit 7", title: "Oblečenie", en: "Clothes", icon: "👕", words: [
        ["basket","kôš"],["cardigan","sveter"],["clothes","oblečenie"],["coat","kabát"],["day","deň"],["dress","šaty"],
        ["every","každý"],["hat","čiapka, klobúk"],["her","jej"],["his","jeho"],["shoes","topánky"],["shorts","šortky"],
        ["socks","ponožky"],["team","tím, družstvo"],["tracksuit","tepláková súprava"],["trousers","nohavice"],
        ["try on","vyskúšať"],["T-shirt|tshirt","tričko"],["what about","a čo tak"]
      ]},
      { id: "g3-u8", tag: "Unit 8", title: "Dom", en: "House", icon: "🏠", words: [
        ["balcony","balkón"],["bathroom","kúpeľňa"],["bedroom","spálňa"],["certificate","diplom"],["chair","stolička"],
        ["dining room","jedáleň"],["downstairs","dole schodmi"],["fish","ryba"],["flat","byt"],["follow","nasledovať"],
        ["front door","predné dvere, hlavný vchod"],["garden","záhrada"],["go","ísť"],["good","dobrý"],["house","dom"],
        ["kitchen","kuchyňa"],["little","malý"],["living room","obývačka"],["next door","vedľa"],["sheep","ovca"],
        ["shoes","topánky"],["show","ukázať"],["surprise","prekvapenie"],["table","stôl"],["through","cez"],
        ["TV","televízor"],["upstairs","hore schodmi"],["want","chcieť"],["well done","výborne"],["work","práca"]
      ]},
      { id: "g3-u9", tag: "Unit 9", title: "Obed", en: "Lunchtime", icon: "🍎", words: [
        ["apple","jablko"],["banana","banán"],["biscuit","keks"],["chair","stolička"],["cheese","syr"],
        ["cherries","čerešne"],["chick","kuriatko"],["chirp","čvirik"],["choose","vybrať"],["drinks","nápoje"],
        ["get dressed","obliecť sa"],["grapes","hrozno"],["lunch","obed"],["lunch box","krabička na jedlo"],
        ["lunchtime","čas obeda"],["pear","hruška"],["pineapple","ananás"],["sandwich","sendvič"],["say","povedať"],
        ["share","podeliť sa"],["teacher","učiteľ"],["today","dnes"],["tomato","paradajka"],["water","voda"]
      ]},
      { id: "g3-u10", tag: "Unit 10", title: "Tvary a vzhľad", en: "Shapes & looks", icon: "🔷", words: [
        ["bath","vaňa"],["best","najlepší"],["blond|blonde","blond, svetlovlasý"],["brown","hnedý"],["circle","kruh"],
        ["count","počítať"],["curly","kučeravý"],["dear","drahý"],["diamond","kosoštvorec"],["friend","priateľ"],
        ["from","od"],["great","skvelý"],["hair","vlasy"],["jumper","sveter"],["just","len"],["long","dlhý"],
        ["new","nový"],["over there","tamto"],["picture","obrázok"],["rectangle","obdĺžnik"],["round","okrúhly"],
        ["short","krátky"],["side","strana"],["smooth","hladký"],["square","štvorec"],["straight","rovný"],
        ["tall","vysoký"],["teeth","zuby"],["tell","povedať"],["the same","taký istý, rovnaký"],["three","tri"],
        ["triangle","trojuholník"]
      ]},
      { id: "g3-u11", tag: "Unit 11", title: "V zoo", en: "At the zoo", icon: "🦒", words: [
        ["at all","vôbec"],["big","veľký"],["cat","mačka"],["elephant","slon"],["fan","ventilátor"],["first","prvý"],
        ["food","jedlo"],["funny","zábavný"],["giraffe","žirafa"],["growl","vrčať"],["guess","hádaj"],["head","hlava"],
        ["hear","počuť"],["hip hooray","hip, hurá"],["hiss","syčať"],["leaves","listy"],["listen","počúvať"],
        ["little","malý"],["man","muž"],["monkey","opica"],["neck","krk, šija"],["next","ďalší"],["on top of","na vrchu"],
        ["parrot","papagáj"],["polar bear","ľadový medveď"],["pretty","pekný"],["seal","tuleň"],["snake","had"],
        ["squawk","škriekať"],["tall","vysoký"],["there","tam"],["tongue","jazyk"],["top","vrch"],["true","pravdivý"],
        ["wrong","nesprávny"],["zoo","zoologická záhrada"]
      ]},
      { id: "g3-u12", tag: "Unit 12", title: "Jedlo a pitie", en: "Food & drink", icon: "🍞", words: [
        ["because","pretože"],["bed","posteľ"],["bread","chlieb"],["café|cafe","kaviareň"],["carrots","mrkva"],
        ["dessert","zákusok"],["dinnertime","čas večere"],["drink","piť"],["finished","hotovo"],["fish","ryba"],
        ["hot chocolate","horúca čokoláda"],["hungry","hladný"],["juice","džús"],["late","neskoro"],["meat","mäso"],
        ["menu","jedálny lístok"],["milk","mlieko"],["pen","pero"],["red","červený"],["rice","ryža"],["school","škola"],
        ["tea","čaj"],["water","voda"],["yogurt|yoghurt","jogurt"]
      ]},
      { id: "g3-u13", tag: "Unit 13", title: "Moja izba", en: "My room", icon: "🛏️", words: [
        ["bed","posteľ"],["bin","kôš"],["blanket","prikrývka"],["cupboard","skriňa"],["eighteen","osemnásť"],
        ["eleven","jedenásť"],["fifteen","pätnásť"],["fig","figa"],["fourteen","štrnásť"],["get in","dostať sa dnu"],
        ["letter","list"],["magazine","časopis"],["more","viac"],["nineteen","devätnásť"],["pillow","vankúš"],
        ["put on sun cream","natrieť si krém na opaľovanie"],["room","izba"],["rug","koberček"],["seventeen","sedemnásť"],
        ["shelf","polica"],["sixteen","šestnásť"],["star","najlepší, veľmi dobrý"],["thirteen","trinásť"],
        ["tidy","uprataný"],["tidy up","upratať"],["tin","plechovka"],["twelve","dvanásť"],["twenty","dvadsať"]
      ]},
      { id: "g3-u14", tag: "Unit 14", title: "Čo vieme robiť", en: "What we can do", icon: "🦊", words: [
        ["alphabet","abeceda"],["anything","čokoľvek"],["beautiful","pekný"],["can","môcť"],["clever","šikovný"],
        ["climb","šplhať"],["cook","variť"],["dance","tancovať"],["do","robiť"],["dog","pes"],["draw","kresliť"],
        ["fast","rýchlo"],["fly","lietať"],["fox","líška"],["fruit","ovocie"],["jump","skákať"],["live","žiť"],
        ["log","poleno"],["nuts","orechy"],["pet","domáci miláčik (zviera)"],["run","bežať"],["silly","bláznivý"],
        ["sing","spievať"],["sit","sedieť"],["smile","usmievať sa"],["song","pieseň"],["stripes","pruhy"],
        ["swim","plávať"],["talk","hovoriť"],["very","veľmi"],["walk","kráčať"],["write","písať"]
      ]},
      { id: "g3-u15", tag: "Unit 15", title: "Pri mori", en: "At the seaside", icon: "🏖️", words: [
        ["alone","sám"],["another","ďalší"],["bat","pálka"],["beach","pláž"],["boat","loď"],["bucket","vedierko"],
        ["clean","čistý"],["crab","krab"],["enjoy","užiť si"],["flavour|flavor","chuť"],["forget","zabudnúť"],
        ["good idea","dobrý nápad"],["ice lolly","nanuk"],["jug","krčah"],["litter","smeti"],
        ["rock pool","jazierko medzi skalami s morskou vodou"],["rug","koberček"],["sandcastle","pieskový hrad"],
        ["sandy","pieskový"],["shell","mušľa"],["spade","lopatka"],["sum","súčet"],["sun cream","krém na opaľovanie"],
        ["the sea","more"],["together","spolu"],["wait","počkať"],["welcome","vitaj"],["wonderful","skvelý"]
      ]}
    ]},

    { grade: 4, units: [] },

    /* ======================= 5. ROČNÍK ======================= */
    { grade: 5, units: [
      /* ---------- 1 Introduction ---------- */
      { id: "g5-1a", chapter: "1 · Introduction", tag: "1A", title: "Ahoj!", en: "Hello", icon: "👋", words: [
        ["class","trieda"],["dialogue|dialog","dialóg"],["different","odlišný"],["expression","výraz"],
        ["introduce","predstaviť sa"],["bye","ahoj (pri lúčení)"],["good afternoon","dobrý deň (poobede)"],
        ["goodbye","dovidenia"],["good evening","dobrý večer"],["good morning","dobré ráno"],["good night","dobrú noc"],
        ["hello","ahoj"],["hi","ahoj, čau"],["How are you?","Ako sa máš?"],["I'm ...","Som ..."],
        ["I'm fine, thanks.","Mám sa dobre, ďakujem."],["It's ...","To je ..."],["My name's ...","Volám sa ..."],
        ["See you later.","Uvidíme sa neskôr."],["What's your name?","Ako sa voláš?"],["Who's this?","Kto je to?"]
      ]},
      { id: "g5-1b", chapter: "1 · Introduction", tag: "1B", title: "V triede", en: "In the classroom", icon: "🏫", words: [
        ["apple","jablko"],["bag","taška"],["board","tabuľa"],["book","kniha"],["boy","chlapec"],["but","ale"],
        ["cat","mačka"],["chair","stolička"],["desk","lavica, písací stôl"],["dog","pes"],["door","dvere"],
        ["exercise book","zošit"],["girl","dievča"],["house","dom"],["label","štítok"],["man","muž, človek"],
        ["orange","pomaranč"],["pen","pero"],["pencil","ceruzka"],["picture","obrázok"],["umbrella","dáždnik"],
        ["watch","hodinky"],["What's this?","Čo je to?"],["Why ...?","Prečo ...?"],["window","okno"],["woman","žena"]
      ]},
      { id: "g5-1b-pokyny", chapter: "1 · Introduction", tag: "1B", title: "Pokyny", en: "Instructions", icon: "📝", words: [
        ["Close your exercise book.","Zavri si zošit."],["Come here.","Poď sem."],["Don't listen.","Nepočúvaj."],
        ["Draw.","Nakresli."],["Give me your book, please.","Daj mi tvoju knihu, prosím."],
        ["Go to the board.","Poď k tabuli."],["Listen.","Počúvaj."],["Look at the picture.","Pozri si obrázok."],
        ["Open your exercise book.","Otvor si zošit."],["Pick up your pencil.","Zober si ceruzku."],
        ["Put down your pencil.","Polož ceruzku."],["Read.","Čítaj."],["Say 'Good morning'.","Povedz „Dobré ráno“."],
        ["Sit down.","Sadni si."],["Stand up.","Postav sa."],["Write on the board.","Napíš na tabuľu."]
      ]},
      { id: "g5-1c", chapter: "1 · Introduction", tag: "1C", title: "Slová z príbehu", en: "Story words", icon: "🦴", words: [
        ["at","na"],["Be careful!","Dávaj pozor!"],["bone","kosť"],["come","prísť"],["collect","zbierať"],
        ["continue","pokračovať"],["double","dvojitý"],["down","dole"],["gate","brána"],["give","dať"],
        ["heaven","nebo"],["hive","včelí úľ"],["home","domov"],["mine","môj (stojace samostatne)"],
        ["my","môj (pred podstatným menom)"],["number","číslo"],["old","starý"],["on","na"],
        ["phone number","telefónne číslo"],["play","hrať"],["roll over","obrátiť sa"],["shoe","topánka"],
        ["some","nejaký"],["stick","palička"],["this","tento"],["tree","strom"],["up","hore"],
        ["What's your mobile number?","Aké je tvoje číslo na mobil?"],
        ["What's your phone number?","Aké je tvoje telefónne číslo?"],["with","s, so"]
      ]},
      { id: "g5-1c-num", chapter: "1 · Introduction", tag: "1C", title: "Čísla", en: "Numbers", icon: "💯", words: [
        ["zero|oh","nula"],["one","jeden"],["two","dva"],["three","tri"],["four","štyri"],["five","päť"],["six","šesť"],
        ["seven","sedem"],["eight","osem"],["nine","deväť"],["ten","desať"],["eleven","jedenásť"],["twelve","dvanásť"],
        ["thirteen","trinásť"],["fourteen","štrnásť"],["fifteen","pätnásť"],["sixteen","šestnásť"],
        ["seventeen","sedemnásť"],["eighteen","osemnásť"],["nineteen","devätnásť"],["twenty","dvadsať"],
        ["twenty-one|twenty one","dvadsaťjeden"],["thirty","tridsať"],["forty","štyridsať"],["fifty","päťdesiat"],
        ["sixty","šesťdesiat"],["seventy","sedemdesiat"],["eighty","osemdesiat"],["ninety","deväťdesiat"],
        ["a hundred|one hundred","sto"]
      ]},
      { id: "g5-1d", chapter: "1 · Introduction", tag: "1D", title: "Ako sa to hláskuje?", en: "How do you spell that?", icon: "🔤", words: [
        ["alphabet","abeceda"],["box","krabica"],["boxes","krabice"],["car","auto"],["child","dieťa"],["children","deti"],
        ["column","stĺpec"],["glass","pohár"],["glasses","poháre"],["How do you spell ...?","Ako vyhláskuješ ...?"],
        ["letter","list"],["Let's ...","Poďme ..."],["me","mňa, mne"],["men","muži"],["only","iba, len"],
        ["oranges","pomaranče"],["people","ľudia"],["person","osoba"],["plural","množné číslo"],
        ["singular","jednotné číslo"],["table","stôl"],["There's ... / There are ...","Tam je ... / Tam sú ..."],
        ["toothbrush","zubná kefka"],["toothbrushes","zubné kefky"],["watches","hodinky (mn. č.)"],["women","ženy"]
      ]},
      { id: "g5-1-culture", chapter: "1 · Introduction", tag: "1 Culture", title: "Mená a ľudia", en: "Names & people", icon: "🌍", words: [
        ["actually","v skutočnosti"],["a lot of","veľa"],["call","volať, nazývať"],["copy","kopírovať"],
        ["country","krajina"],["dad","oco"],["English","anglický"],["everyone","každý"],["first name","krstné meno"],
        ["friend","priateľ"],["from","z, od"],["full name","celé meno"],["have","mať"],["initials","iniciálky"],
        ["it isn't|it is not","nie je"],["middle name","druhé meno"],["nickname","prezývka"],["often","často"],
        ["parents","rodičia"],["real name","skutočné meno"],["short for","skrátene"],["short form","stiahnutá forma"],
        ["so","tak, taký"],["surname","priezvisko"],["teacher","učiteľ"],["that's ...","to je ..."],
        ["This is ...","Toto je ..."],["too","tiež"],["use","používať"]
      ]},
      { id: "g5-1-maths", chapter: "1 · Introduction", tag: "1 Maths", title: "Matematika", en: "Maths", icon: "➗", words: [
        ["blue","modrý"],["dart","šípka"],["divided by","delené"],["equals","rovná sa"],
        ["go from ... to ... and back","choď z ... do ... a späť"],["green","zelený"],["How far is it?","Ako je to ďaleko?"],
        ["maths|math","matematika"],["minus","mínus"],["score","výsledok"],["sum","počítanie"],["times","-krát"],
        ["What's ...?","Koľko je ...?"],["winner","víťaz"],["yellow","žltý"]
      ]},
      { id: "g5-1-project", chapter: "1 · Introduction", tag: "1 Project", title: "Môj projekt", en: "Your project", icon: "📋", words: [
        ["about","o"],["bed","posteľ"],["best friend","najlepší priateľ"],["bike","bicykel"],["caption","nadpis"],
        ["computer","počítač"],["fall out","vypadnúť"],["favourite|favorite","obľúbený"],["find","nájsť"],
        ["football team","futbalové mužstvo"],["in","v"],["life","život"],["little","malý"],["make","robiť, vyrábať"],
        ["none","žiadny"],["no one","nikto"],["poster","plagát"],["present","prezentovať"],["project","projekt"],
        ["put","dať"],["say","povedať"],["speech bubble","bublina"],["thing","vec"],["together","spolu"]
      ]},

      /* ---------- 2 Friends and family ---------- */
      { id: "g5-2a", chapter: "2 · Friends and family", tag: "2A", title: "Odkiaľ si?", en: "Where are you from?", icon: "🧭", words: [
        ["classroom","trieda"],["He isn't from ...","Nie je z ..."],["I'm from ...","Som z ..."],
        ["I'm not from ...","Nie som z ..."],["Internet friends","priatelia z internetu"],["She's from ...","Ona je z ..."],
        ["These are ...","Toto sú ..."],["They're from ...","Sú z ..."],["We aren't from ...","Nie sme z ..."],
        ["We're from ...","Sme z ..."],["Who are ...?","Kto sú ...?"],["Where are they from?","Odkiaľ sú?"]
      ]},
      { id: "g5-2a-countries", chapter: "2 · Friends and family", tag: "2A", title: "Krajiny a mestá", en: "Countries and cities", icon: "🗺️", words: [
        ["Australia","Austrália"],["Beijing","Peking"],["Brazil","Brazília"],["Britain","Británia"],["China","Čína"],
        ["France","Francúzsko"],["Germany","Nemecko"],["Greece","Grécko"],["Italy","Taliansko"],["Japan","Japonsko"],
        ["London","Londýn"],["Milan","Miláno"],["Moscow","Moskva"],["Paris","Paríž"],["Russia","Rusko"],
        ["Spain","Španielsko"],["Tokyo","Tokio"]
      ]},
      { id: "g5-2b", chapter: "2 · Friends and family", tag: "2B", title: "Moja rodina", en: "My family", icon: "👪", words: [
        ["connect","spojiť"],["family","rodina"],["garden","záhrada"],["mobile","mobil"],["photo","fotka"],
        ["Where is ...? / Where are ...?","Kde je ...? / Kde sú ...?"],["Whose ... is this?","Čí ... je to?"],
        ["aunt","teta"],["brother","brat"],["cousin","sesternica / bratranec"],["daughter","dcéra"],["father","otec"],
        ["grandchildren","vnúčatá"],["grandfather|granddad","starý otec / starký"],
        ["grandmother|grandma","stará mama / starká"],["grandparents","starí rodičia"],["mother|mum|mom","mama (mamička)"],
        ["parents","rodičia"],["sister","sestra"],["son","syn"],["uncle","strýko"],["her","jej"],["his","jeho"],
        ["its","jeho (vecí, zvierat)"],["our","náš"],["their","ich"],["your","tvoj / váš"]
      ]},
      { id: "g5-2c", chapter: "2 · Friends and family", tag: "2C", title: "Mickie, Millie a Mut", en: "Mickie, Millie and Mut", icon: "🐶", words: [
        ["alive","nažive"],["Are they ...?","Sú ...?"],["Are you ...?","Si ...? / Ste ...?"],["avenue","ulica"],
        ["classmate","spolužiak"],["dead","mŕtvy"],["Excuse me.","Prepáč(te)."],["film star","filmová hviezda"],
        ["friendly","priateľský"],["growl","(za)vrčať"],["Is this ...?","Je to ...?"],["neighbour|neighbor","sused"],
        ["new","nový"],["no","nie"],["over there","tam (neďaleko)"],["Pleased to meet you.","Teší ma."],
        ["policeman","policajt"],["postman","poštár"],["road","cesta"],["singer","spevák"],["sportsperson","športovec"],
        ["student","študent"],["Thank you.","Ďakujem."],["That's ...","To je ..."],["very","veľmi"],["yes","áno"]
      ]},
      { id: "g5-2d", chapter: "2 · Friends and family", tag: "2D", title: "Aký je dnes deň?", en: "What day is it today?", icon: "📅", words: [
        ["at home","doma"],["at the shops","na nákupoch"],["birthday","narodeniny"],["caller","volajúci"],
        ["chart","tabuľka"],["days of the week","dni v týždni"],["for","pre"],["Happy birthday.","Všetko najlepšie."],
        ["How old are you?","Koľko máš rokov?"],["How old is he?","Koľko má rokov?"],["record","nahrávka"],
        ["show","šou"],["song","pieseň"],["today","dnes"],["week","týždeň"],["What is ...?","Čo je ...?"],
        ["When is his birthday?","Kedy má narodeniny?"],["Whose is ...?","Čí je ...?"],["Monday","pondelok"],
        ["Tuesday","utorok"],["Wednesday","streda"],["Thursday","štvrtok"],["Friday","piatok"],["Saturday","sobota"],
        ["Sunday","nedeľa"]
      ]},
      { id: "g5-2-culture", chapter: "2 · Friends and family", tag: "2 Culture", title: "Mesto a ulica", en: "City life", icon: "🏙️", words: [
        ["address","adresa"],["bank","banka"],["big","veľký"],["British","britský"],["city","veľkomesto"],
        ["crossing","križovatka"],["detective","detektív"],["famous","slávny"],["house number","číslo domu"],
        ["just","práve"],["know","vedieť"],["outside","vonku"],["place","miesto"],
        ["postcode","poštové smerovacie číslo"],["Prime Minister","premiér"],["real","skutočný"],
        ["recording studio","nahrávacie štúdio"],["room","miestnosť, izba"],["street","ulica"],["town","mesto"],
        ["webcam","webkamera"]
      ]},
      { id: "g5-2-geo", chapter: "2 · Friends and family", tag: "2 Geography", title: "Zemepis", en: "Geography", icon: "🌏", words: [
        ["between","medzi"],["cold","studený, chladný"],["continent","kontinent"],["desert","púšť"],
        ["geography","zemepis"],["map","mapa"],["mountain","vrch"],["mountain range","pohorie"],["next to","vedľa"],
        ["ocean","oceán"],["point","ukázať"],["river","rieka"],["world","svet"],["Africa","Afrika"],
        ["Amazon River","rieka Amazonka"],["Antarctica","Antarktída"],["Asia","Ázia"],["Europe","Európa"],
        ["Himalayas","Himaláje"],["Nile River","rieka Níl"],["North America","Severná Amerika"],["Oceania","Oceánia"],
        ["Rocky Mountains","Skalnaté hory"],["Sahara Desert","púšť Sahara"],["South America","Južná Amerika"],
        ["Arctic Ocean","Severný ľadový oceán"],["Atlantic Ocean","Atlantický oceán"],["Indian Ocean","Indický oceán"],
        ["Pacific Ocean","Tichý oceán"]
      ]},
      { id: "g5-2-project", chapter: "2 · Friends and family", tag: "2 Project", title: "Opakovanie a projekt", en: "Revision & project", icon: "🌳", words: [
        ["black","čierny"],["card","karta"],["cue","nápoveda"],["family tree","rodokmeň"],["bring back","vrátiť"],
        ["drawing","kresba"],["interview","rozhovor"],["over","za"],["plan","plánovať"],["sea","more"],["title","titul"]
      ]},

      /* ---------- 3 My world ---------- */
      { id: "g5-3a", chapter: "3 · My world", tag: "3A", title: "Mám počítač", en: "I've got a computer", icon: "💻", words: [
        ["bedroom","spálňa"],["good","dobrý"],["have got|have","mať"],["living room","obývačka"],["lucky","šťastný"],
        ["camera","fotoaparát"],["computer game","počítačová hra"],["DVD player","DVD prehrávač"],
        ["games console","herná konzola"],["MP3 player","MP3 prehrávač"],["radio","rádio"],
        ["remote-controlled car","auto na diaľkové ovládanie"],["television","televízia"]
      ]},
      { id: "g5-3b", chapter: "3 · My world", tag: "3B", title: "Mutov darček", en: "Mut's present", icon: "🎁", words: [
        ["act","hrať"],["basket","kôš"],["ball","lopta"],["blanket","prikrývka"],["cap","čiapka"],["cover","zakryť"],
        ["cricket bat","kriketová pálka"],["describe","opísať"],["difference","rozdiel"],["jumper","sveter"],
        ["mouth","ústa"],["nice","pekný, milý"],["now","teraz"],["present","darček"],["Really?","Naozaj?"],
        ["school","škola"],["small","malý"],["these","títo"],["T-shirt|tshirt","tričko"],["brown","hnedý"],
        ["grey|gray","sivý"],["orange","oranžový"],["red","červený"],["white","biely"],["bad","zlý"],["long","dlhý"],
        ["short","krátky"],["thick","hrubý"],["thin","tenký"]
      ]},
      { id: "g5-3c", chapter: "3 · My world", tag: "3C", title: "Máš domáce zvieratko?", en: "Have you got a pet?", icon: "🐹", words: [
        ["animal","zviera"],["asleep","spiaci (to be asleep = spať)"],["band","skupina"],["beautiful","krásny"],
        ["beginning with ...","začínajúci na ..."],["boring","nudný"],["pet","domáci miláčik"],["tail","chvost"],
        ["What kind of ... is it?","Aký druh ... je to?"],["bird","vták"],["budgie","andulka"],["fish","ryba"],
        ["hamster","škrečok"],["horse","kôň"],["mice","myši"],["mouse","myš"],["parrot","papagáj"],["rabbit","králik"],
        ["rat","potkan"],["snake","had"],["spider","pavúk"]
      ]},
      { id: "g5-3d", chapter: "3 · My world", tag: "3D", title: "Moja škola", en: "My school", icon: "🏫", words: [
        ["afternoon","popoludnie"],["assembly","zhromaždenie"],["break","prestávka"],["compare","porovnať"],
        ["each","každý"],["good at","dobrý v"],["great","výborný"],["last","posledný"],["lesson","vyučovacia hodina"],
        ["lunch","obed"],["next","ďalší"],["registration","registrácia"],["subject","predmet"],["term","polrok"],
        ["timetable","rozvrh hodín"],["uniform","uniforma"],["wear","nosiť, mať oblečené"],["year","rok"]
      ]},
      { id: "g5-3d-subjects", chapter: "3 · My world", tag: "3D", title: "Školské predmety", en: "School subjects", icon: "📚", words: [
        ["Art and Design","umenie a dizajn"],["Biology","biológia"],["Chemistry","chémia"],
        ["Citizenship","občianska náuka"],["Design and Technology","dizajn a technológie"],["English","angličtina"],
        ["French","francúzština"],["History","dejepis"],["ICT","informatika"],["Music","hudobná výchova"],
        ["PE","telesná výchova"],["Physics","fyzika"],["RE","náboženská výchova"],["Science","prírodopis, prírodné vedy"]
      ]},
      { id: "g5-3-culture", chapter: "3 · My world", tag: "3 Culture", title: "Škola v Anglicku", en: "School in England", icon: "🇬🇧", words: [
        ["about","o"],["England","Anglicko"],["from ... to ...","od ... do ..."],["half","polovica"],
        ["morning","ráno, dopoludnie"],["packed lunch","balíček s obedom"],["primary school","základná škola"],
        ["pupil","žiak"],["sandwich","sendvič"],["school day","vyučovací deň"],["school system","školský systém"],
        ["secondary school","stredná škola"],["sports match","športový zápas"]
      ]},
      { id: "g5-3-body", chapter: "3 · My world", tag: "3 Science", title: "Telo zvieraťa", en: "Parts of an animal's body", icon: "🦜", words: [
        ["human","človek"],["touch","dotknúť sa"],["arm","ruka (rameno)"],["beak","zobák"],["body","telo"],["ear","ucho"],
        ["eye","oko"],["feathers","perie"],["foot","chodidlo"],["fur","srsť"],["hand","ruka"],["head","hlava"],
        ["leg","noha"],["nose","nos"],["teeth","zuby"],["whiskers","fúzy (zvieracie)"],["wing","krídlo"],
        ["adjective","prídavné meno"],["hair","vlasy"],["possessions","majetok"],["chorus","refrén"],["day","deň"],
        ["Games","športové hry"]
      ]},

      /* ---------- 4 Time ---------- */
      { id: "g5-4a", chapter: "4 · Time", tag: "4A", title: "Koľko je hodín?", en: "What's the time?", icon: "⏰", words: [
        ["activity","činnosť"],["birthday party","narodeninový večierok"],["clock","hodiny"],["concert","koncert"],
        ["dance","tanečný"],["exam","skúška"],["game","hra"],["half past","pol ..."],["hockey","hokej"],
        ["match","zápas"],["o'clock","... hodín"],["party","večierok"],["past","po"],["piano","klavír"],
        ["punctuation","interpunkcia"],["quarter past","štvrť na"],["quarter to","trištvrte na"],["tennis","tenis"],
        ["time","čas"],["to","do"],["volleyball","volejbal"],["What's the time?","Koľko je hodín?"]
      ]},
      { id: "g5-4b", chapter: "4 · Time", tag: "4B", title: "Môj deň", en: "My day", icon: "🌅", words: [
        ["after","po"],["arrive at school","prísť do školy"],["at the weekend","cez víkend"],["before","pred"],
        ["breakfast","raňajky"],["brush your teeth","umy si zuby"],["bus","autobus"],["coat","kabát"],
        ["dinner","večera"],["do your homework","urob si úlohy"],["finish","skončiť"],["get up","vstať"],
        ["go home","ísť domov"],["go on the Internet","ísť na internet"],["go to bed","ísť do postele"],
        ["go to school","ísť do školy"],["go to sleep","ísť spať"],["go to work","ísť do práce"],
        ["half an hour","polhodina"],["have a shower","sprchovať sa"],["have breakfast","raňajkovať"],
        ["have dinner","večerať"],["have lunch","obedovať"],["homework","domáca úloha"],["in bed","v posteli"],
        ["Internet exchange","internetová spolupráca"],["kitchen","kuchyňa"],["listen to music","počúvať hudbu"],
        ["listen to the radio","počúvať rádio"],["magazine","časopis"],["or","alebo"],["put on","obliecť si / obuť si"],
        ["school bus","školský autobus"],["start","začať"],["take the bus","ísť autobusom"],
        ["take the train","ísť vlakom"],["talk about","rozprávať (sa) o"],["TV","televízia"],["typical","typický"],
        ["walk","ísť pešo"],["watch TV","pozerať televíziu"]
      ]},
      { id: "g5-4c", chapter: "4 · Time", tag: "4C", title: "Voľný čas", en: "Free time", icon: "🎸", words: [
        ["badge","odznak"],["collect","zbierať"],["comic","komiks"],["football card","kartička futbalistu"],
        ["free time","voľný čas"],["go skiing","ísť sa lyžovať"],["go swimming","ísť plávať"],["happen","stať sa"],
        ["like","mať rád"],["paragraph","odsek"],["play a musical instrument","hrať na hudobnom nástroji"],
        ["play computer games","hrať počítačové hry"],["play football","hrať futbal"],["play ice hockey","hrať hokej"],
        ["play tennis","hrať tenis"],["play the guitar","hrať na gitare"],["play the piano","hrať na klavíri"],
        ["play the violin","hrať na husliach"],["Slovakia","Slovensko"],["sport","šport"],
        ["sports centre|sports center","športové centrum"],["team","tím, mužstvo"],["Thailand","Thajsko"],
        ["training","tréning"],["watch DVDs","pozerať DVD"]
      ]},
      { id: "g5-4d", chapter: "4 · Time", tag: "4D", title: "Mickie, Millie a Mut", en: "Mickie, Millie and Mut", icon: "🎾", words: [
        ["always","vždy"],["because","pretože"],["catch","chytiť"],["every","každý"],["in brackets","v zátvorke"],
        ["play sports","robiť športy"],["table tennis","stolný tenis"],["tennis ball","tenisová loptička"],
        ["talk to","rozprávať sa s"],["visit","navštíviť"],["Why not?","Prečo nie?"]
      ]},
      { id: "g5-4-sports", chapter: "4 · Time", tag: "4 Culture", title: "Šport", en: "Sports", icon: "🏅", words: [
        ["Canada","Kanada"],["do athletics","robiť atletiku"],["each week","každý týždeň"],["event","podujatie"],
        ["How often ...?","Ako často ...?"],["normally","normálne"],["popular","populárny"],["prize","cena, odmena"],
        ["race","preteky"],["sports day","športový deň"],["summer","leto"],["winter","zima"],
        ["American football","americký futbal"],["athletics","atletika"],["baseball","bejzbal"],
        ["basketball","basketbal"],["cricket","kriket"],["high jump","skok do výšky"],["javelin","hod oštepom"],
        ["long jump","skok do diaľky"],["netball","dievčenský basketbal"],["snooker","biliard"]
      ]},
      { id: "g5-4-music", chapter: "4 · Time", tag: "4 Music", title: "Hudobné nástroje", en: "Musical instruments", icon: "🎺", words: [
        ["kind","druh"],["lots of","veľa"],["mime","napodobniť, imitovať"],["clarinet","klarinet"],
        ["double bass","kontrabas"],["drums","bubny"],["electric guitar","elektrická gitara"],["flute","flauta"],
        ["harmonica","harmonika"],["harp","harfa"],["keyboards","klávesy"],["percussion instrument","bicie"],
        ["saxophone","saxofón"],["string instrument","sláčikový nástroj"],["tambourine","tamburína"],
        ["trombone","trombón"],["trumpet","trúba"],["wind instrument","dychový nástroj"],["xylophone","xylofón"]
      ]},
      { id: "g5-4-project", chapter: "4 · Time", tag: "4 Project", title: "Opakovanie a projekt", en: "Revision & project", icon: "📸", words: [
        ["by car","autom"],["in the evening","večer"],["it's my turn","som na rade"],["add","pridať"],
        ["all week","celý týždeň"],["at all","vôbec"],["check","kontrolovať"],["comment","komentovať"],
        ["cycling","bicyklovanie"],["digital","digitálny"],["each other","navzájom"],["every week","každý týždeň"],
        ["face","tvár"],["guess","hádať"],["help","pomáhať"],["hobby","záľuba, koníček"],["It's time for ...","Je čas na ..."],
        ["stamp","známka (poštová)"],["take a photo","fotiť"],["until|till","(až) do"]
      ]},

      /* ---------- 5 Places ---------- */
      { id: "g5-5a", chapter: "5 · Places", tag: "5A", title: "Moja izba", en: "My room", icon: "🛏️", words: [
        ["bedside table","nočný stolík"],["bookshelf","polica na knihy"],["carpet","koberec"],
        ["chest of drawers","komoda"],["football boots","kopačky"],["lamp","lampa"],["mirror","zrkadlo"],
        ["model car","model auta"],["position","poloha"],["rug","rohožka"],["see","vidieť"],
        ["sports star","športová hviezda"],["wall","stena"],["wardrobe","šatník"],["behind","za"],
        ["in front of","pred"],["opposite","oproti"],["under","pod"]
      ]},
      { id: "g5-5b", chapter: "5 · Places", tag: "5B", title: "Náš dom", en: "Our house", icon: "🏡", words: [
        ["eat","jesť"],["flat","byt"],["here","tu"],["plan","plán"],["telephone","telefón"],["to let","na prenájom"],
        ["bathroom","kúpeľňa"],["cellar","pivnica"],["dining room","jedáleň"],["downstairs","prízemie"],
        ["garage","garáž"],["garden","záhrada"],["hall","predsieň"],["stairs","schody"],["toilet","toaleta"],
        ["upstairs","poschodie"],["armchair","kreslo"],["bath","vaňa"],["cooker","varič"],
        ["cupboard","kuchynská linka"],["curtain","záclona, záves"],["fridge","chladnička"],["light","svetlo"],
        ["sink","výlevka"],["sofa","gauč"],["washbasin","umývadlo"]
      ]},
      { id: "g5-5c", chapter: "5 · Places", tag: "5C", title: "Naše mesto", en: "Our town", icon: "🏛️", words: [
        ["closed","zatvorené"],["dream town","mesto snov"],["How many ... are there?","Koľko ... je tam?"],
        ["I see.","Aha. Rozumiem."],["Is there ...?","Je tam ...?"],["mention","spomenúť"],
        ["town centre|town center","centrum mesta"],["bank","banka"],["bus station","autobusová stanica"],
        ["bus stop","autobusová zastávka"],["cafe|café","kaviareň"],["church","kostol"],["cinema","kino"],
        ["hospital","nemocnica"],["museum","múzeum"],["post office","pošta"],["shop","obchod"],
        ["shopping centre|shopping center","nákupné centrum"],["sports shop","obchod so športovými potrebami"],
        ["square","námestie"],["station","stanica"],["sweet shop","obchod s cukrovinkami"],
        ["swimming pool","bazén"],["theatre|theater","divadlo"],["train station","železničná stanica"]
      ]},
      { id: "g5-5d", chapter: "5 · Places", tag: "5D", title: "Mickie, Millie a Mut", en: "Mickie, Millie and Mut", icon: "🚲", words: [
        ["anymore","už viac nie"],["can","vedieť"],["carry","niesť"],["cross","prejsť (cez)"],["day out","voľný deň"],
        ["dream","sen"],["feet","nohy"],["fly","lietať"],["go back","vrátiť sa"],["heavy","ťažký"],["hurt","zraniť"],
        ["join","pridať sa"],["Look.","Pozri."],["lost","stratený"],["miss a turn","vynechať kolo"],
        ["ride a bike","jazdiť na bicykli"],["ride a horse","jazdiť na koni"],["run","bežať"],["ski","lyžovať sa"],
        ["speak","hovoriť"],["stop","zastávka"],["swim","plávať"],["tired","unavený"],["train","vlak"],
        ["We're lost.","Stratili sme sa."],["wind","vietor"],["wrong","nesprávny"]
      ]},
      { id: "g5-5-culture", chapter: "5 · Places", tag: "5 Culture", title: "Slávne mestá", en: "Famous towns", icon: "🏰", words: [
        ["also","tiež"],["anything","niečo, hocičo"],["called","nazývaný"],["castle","hrad"],["coast","pobrežie"],
        ["every day","každý deň"],["famous for","preslávený (čím)"],["good for","vhodný pre ..."],["ice rink","klzisko"],
        ["ice skating","korčuľovanie"],["idea","myšlienka"],["kilometre|kilometer","kilometer"],["library","knižnica"],
        ["live","žiť, bývať"],["market","trh"],["modern","moderný"],["near","blízko"],["office","úrad, kancelária"],
        ["part","časť"],["police station","policajná stanica"],["restaurant","reštaurácia"],["south-east|southeast","juhovýchod"],
        ["think","myslieť"],["Town Hall","radnica"],["visitor","návštevník"],["water","voda"]
      ]},
      { id: "g5-5-geo", chapter: "5 · Places", tag: "5 Geography", title: "Krajina a mestá", en: "Land and towns", icon: "🌉", words: [
        ["any","nejaký, hocijaký"],["attack","útočiť"],["bridge","most"],["buy","kupovať"],["by boat","na člne"],
        ["cow","krava"],["crossroads","križovatka"],["drink","piť"],["easy","ľahký"],["factory","továreň"],
        ["farm","farma"],["flood","záplava"],["ford","brod"],["hill","kopec"],["important","dôležitý"],["lake","jazero"],
        ["need","potrebovať"],["Prague","Praha"],["reason","dôvod"],["safe","bezpečný"],["sell","predať"],
        ["similar","podobný"],["travel","cestovať"],["village","dedina"],["wash","umývať (sa)"]
      ]},
      { id: "g5-5-project", chapter: "5 · Places", tag: "5 Project", title: "Opakovanie a projekt", en: "Revision & project", icon: "🗺️", words: [
        ["German","nemecký"],["left","ľavý"],["bookshop","kníhkupectvo"],["clothes shop","obchod s odevami"],
        ["doctor's","ordinácia"],["fire station","požiarna stanica"],["get","získať"],["in the middle of","v strede"],
        ["love","mať rád"],["take a look","pozrieť sa"],["walk around","prechádzať sa"],["welcome","vitajte"]
      ]},

      /* ---------- 6 People ---------- */
      { id: "g5-6a", chapter: "6 · People", tag: "6A", title: "Moji priatelia", en: "My friends", icon: "👫", words: [
        ["description","opis"],["page","strana"],["quite","celkom"],["strange","zvláštny"],["bald","holohlavý"],
        ["beard","brada"],["black hair","čierne vlasy"],["blue eyes","modré oči"],["brown eyes","hnedé oči"],
        ["brown hair","hnedé vlasy"],["dark hair","tmavé vlasy"],["fair hair","svetlé vlasy"],["fat","tučný"],
        ["glasses","okuliare"],["green eyes","zelené oči"],["long hair","dlhé vlasy"],["moustache|mustache","fúzy"],
        ["slim","štíhly"],["short hair","krátke vlasy"],["tall","vysoký"]
      ]},
      { id: "g5-6b", chapter: "6 · People", tag: "6B", title: "Sobotné ráno", en: "Saturday morning", icon: "🎈", words: [
        ["balloon","balón"],["Can I help you?","Môžem ti pomôcť?"],["cup of coffee","šálka kávy"],
        ["department store","obchodný dom"],["get in","nastúpiť (do auta)"],["get on","nastúpiť (do autobusu, vlaku)"],
        ["Here they are.","Tu sú."],["Here you are.","Nech sa páči."],["How much is ...?","Koľko stojí ...?"],
        ["ill","chorý"],["in the car","v aute"],["lie","klamať"],["Look out of the window.","Pozri sa z okna."],
        ["newspaper","noviny"],["phone","telefón"],["sit","sedieť"],["wait for","čakať na"],
        ["What are you doing?","Čo robíš?"]
      ]},
      { id: "g5-6c", chapter: "6 · People", tag: "6C", title: "Ideme nakupovať?", en: "Are we going to the shops?", icon: "🛍️", words: [
        ["at the moment","práve teraz"],["best","najlepší"],["brush","(vy)kefovať"],["clothes","oblečenie"],
        ["Come on.","Poďme!"],["cook","variť"],["first","prvý"],["fur","kožušina"],["go out","ísť von"],
        ["have a bath","kúpať sa"],["It's raining.","Prší."],["It's sunny.","Je slnečno."],["jeans","rifle, džínsy"],
        ["on the bus","v autobuse"],["pet show","výstava domácich zvieratiek"],["practise|practice","precvičiť si"],
        ["prize","cena"],["smart","elegantný"],["sweatshirt","tričko s dlhým rukávom"],["usually","zvyčajne"],
        ["Well done!","Dobrá práca!"]
      ]},
      { id: "g5-6d", chapter: "6 · People", tag: "6D", title: "Oblečenie", en: "Clothes", icon: "👑", words: [
        ["clever","múdry"],["far away","ďaleko"],["gold","zlatý"],["hold","držať"],["king","kráľ"],["laugh","smiať sa"],
        ["look at","pozerať na"],["magic","zázračný"],["Majesty","veličenstvo"],["one day","jedného dňa"],
        ["palace","palác"],["royal","kráľovský"],["shout","kričať"],["sing","spievať"],["stupid","hlúpy"],
        ["tailor","krajčír"],["true","pravdivý"],["boots","čižmy"],["dress","šaty"],["hat","klobúk"],["jacket","sako"],
        ["shirt","košeľa"],["shorts","šortky"],["skirt","sukňa"],["socks","ponožky"],["tie","kravata"],
        ["trainers|sneakers","tenisky"],["trousers|pants","nohavice"]
      ]},
      { id: "g5-6-culture", chapter: "6 · People", tag: "6 Culture", title: "Jazyky sveta", en: "Languages of the world", icon: "🗣️", words: [
        ["African","africký"],["be born","narodiť sa"],["Chinese","čínsky"],["difficult","ťažký, zložitý"],
        ["English-speaking","hovoriaci po anglicky"],["European","európsky"],["Hungary","Maďarsko"],["Indian","indický"],
        ["language","jazyk"],["learn","učiť sa"],["live abroad","žiť v zahraničí"],["luckily","našťastie"],
        ["national","národný"],["New Zealand","Nový Zéland"],["Nigeria","Nigéria"],["Scotland","Škótsko"],
        ["Singapore","Singapúr"],["South Africa","Južná Afrika"],["Spanish","španielsky"],["Tamil","tamilčina"],
        ["Turkey","Turecko"],["Turkish","turecký"],["young people","mladí ľudia"]
      ]},
      { id: "g5-6-project", chapter: "6 · People", tag: "6 Project", title: "Umenie a projekt", en: "Art & project", icon: "🎨", words: [
        ["closely","zblízka"],["dot","bodka"],["grass","tráva"],["island","ostrov"],["paint","maľovať"],
        ["painter","maliar"],["painting","maľba"],["really","naozaj"],["River Seine","rieka Seina"],["row","veslovať"],
        ["stand","stáť"],["late","neskoro"],["all the time","po celý čas"],["as a rule","zvyčajne, spravidla"],
        ["banana","banán"],["corridor","chodba"],["feel","cítiť"],["fine","dobre"],["keep","udržiavať"],
        ["look like","vyzerať ako"],["post","odoslať"],["pyjamas|pajamas","pyžamo"],["share","zdieľať"],
        ["sometimes","niekedy"],["upload","nahrať"],["website","webová stránka"]
      ]},

      /* ---------- Vocabulary and Reading ---------- */
      { id: "g5-vr4", chapter: "Vocabulary and Reading", tag: "V&R 4", title: "Čítanie 4", en: "Reading Unit 4", icon: "📖", words: [
        ["a bit of","trochu"],["bring","priniesť"],["cart","voz"],["dangerous","nebezpečný"],["dark","tmavý"],
        ["food","jedlo"],["go for a walk","ísť na prechádzku"],["happy","šťastný"],["hard","tvrdý"],["hide","skryť sa"],
        ["jump on","naskočiť na"],["loud","hlasný"],["noise","hluk"],["noisy","hlučný"],["quiet","tichý"],
        ["soft","mäkký"],["story","príbeh"],["suddenly","náhle"],["the next day","na druhý deň"],["Well, ...","Nuž, ..."],
        ["wet","mokrý"]
      ]},
      { id: "g5-vr5", chapter: "Vocabulary and Reading", tag: "V&R 5", title: "Čítanie 5", en: "Reading Unit 5", icon: "👣", words: [
        ["a long time ago","dávno"],["arrive","prísť"],["baby","dieťa"],["bang on","búchať na"],["bite","hrýzť"],
        ["bread","chlieb"],["bread roll","žemľa"],["cradle","kolíska"],["cry","plakať"],["daddy","ocko"],
        ["far","ďaleko"],["fire","oheň"],["follow","ísť za, nasledovať (niekoho)"],["giant","obor"],
        ["here comes ...","prichádza ..."],["hungry","hladný"],["husband","manžel"],["Ireland","Írsko"],
        ["land","pristáť"],["meet","stretnúť"],["Oh dear.","Preboha."],["open","otvoriť"],["other","druhý, iný"],
        ["Ow!","Au!"],["pick up","vziať, zdvihnúť"],["quick","rýchly"],["rock","skala"],["side","strana"],
        ["smell","voňať"],["soon","čoskoro"],["stone","kameň"],["strong","silný"],["throw","hodiť"],
        ["What's wrong?","Čo sa stalo?"],["wife","manželka"],["wood","drevo"]
      ]},
      { id: "g5-vr6", chapter: "Vocabulary and Reading", tag: "V&R 6", title: "Čítanie 6", en: "Reading Unit 6", icon: "🦊", words: [
        ["again","znova"],["branch","konár"],["cheese","syr"],["climb","vyliezť"],["crow","vrana"],["fall","padnúť"],
        ["fox","líška"],["look up","pozrieť hore"],["lovely","nádherný"],["piece","kus"],["please","prosím"],
        ["shine","žiariť"],["smile","usmievať sa"]
      ]}
    ]},

    { grade: 6, units: [] },
    { grade: 7, units: [] },
    { grade: 8, units: [] },
    { grade: 9, units: [] }
  ]
};
