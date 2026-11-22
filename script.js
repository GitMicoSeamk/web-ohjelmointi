console.log("script.js ladattu");

document.addEventListener("DOMContentLoaded", () => {
    const saunaLista = document.getElementById("sauna-lista");
    if (!saunaLista) return;

    const hakuKentta = document.getElementById("sauna-haku");
    const kokoSuodatin = document.getElementById("koko-suodatin");
    const lajitteluValikko = document.getElementById("sauna-lajittelu");
    const nollaaNappi = document.getElementById("nollaa-suodattimet");
    const tilarivi = document.getElementById("tilarivi");

    const alkuperaisetKortit = Array.from(saunaLista.querySelectorAll(".laatikko"));

    function paivitaNaytto() {
        const hakusana = hakuKentta.value.trim().toLowerCase();
        const minKoko = Number(kokoSuodatin.value);
        const lajittelu = lajitteluValikko.value;

        // 1. Suodata kortit hakusanan ja koon mukaan
        let suodatetut = alkuperaisetKortit.filter((kortti) => {
            const teksti = kortti.textContent.toLowerCase();
            const koko = Number(kortti.dataset.koko);

            const vastaaHakua = hakusana === "" || teksti.includes(hakusana);
            const vastaaKokoa = koko >= minKoko;
            return vastaaHakua && vastaaKokoa;
        });

        // 2. Lajittele suodatetut kortit
        suodatetut = [...suodatetut].sort((a, b) => {
            if (lajittelu === "hinta-asc") {
                return Number(a.dataset.hintaArki) - Number(b.dataset.hintaArki);
            }
            if (lajittelu === "hinta-desc") {
                return Number(b.dataset.hintaArki) - Number(a.dataset.hintaArki);
            }
            if (lajittelu === "koko-desc") {
                return Number(b.dataset.koko) - Number(a.dataset.koko);
            }
            return alkuperaisetKortit.indexOf(a) - alkuperaisetKortit.indexOf(b);
        });

        // 3. Päivitä DOM: piilota suodattamattomat ja järjestä näkyvät
        alkuperaisetKortit.forEach((kortti) => {
            kortti.hidden = true;
        });

        suodatetut.forEach((kortti) => {
            kortti.hidden = false;
            saunaLista.appendChild(kortti);
        });

        // 4. Päivitä tilarivi
        const yhteensa = alkuperaisetKortit.length;
        const nakyy = suodatetut.length;
        tilarivi.textContent = `Näytetään ${nakyy} / ${yhteensa} saunaa`;
    }

    hakuKentta.addEventListener("input", paivitaNaytto);
    kokoSuodatin.addEventListener("change", paivitaNaytto);
    lajitteluValikko.addEventListener("change", paivitaNaytto);

    nollaaNappi.addEventListener("click", () => {
        hakuKentta.value = "";
        kokoSuodatin.value = "0";
        lajitteluValikko.value = "oletus";
        paivitaNaytto();
        hakuKentta.focus();
    });

    paivitaNaytto();
});

document.addEventListener("DOMContentLoaded", () => {
    const lomake = document.getElementById("varauslomake");
    if (!lomake) return;

    const tallennusAvain = "kuivasjarvi_varauspyynnot_v1";

    const nimiInput = document.getElementById("nimi");
    const puhelinInput = document.getElementById("puhelin");
    const saunaSelect = document.getElementById("sauna");
    const iltaInput = document.getElementById("ilta");
    const viestiInput = document.getElementById("viesti");

    const virheNimi = document.getElementById("virhe-nimi");
    const virhePuhelin = document.getElementById("virhe-puhelin");
    const virheSauna = document.getElementById("virhe-sauna");
    const virheIlta = document.getElementById("virhe-ilta");
    const lomakeTila = document.getElementById("lomake-tila");

    const listaElementti = document.getElementById("tallennetut-pyynnot");
    const tyhjennaNappi = document.getElementById("tyhjenna-pyynnot");

    function haePyynnot() {
        try {
            const raaka = localStorage.getItem(tallennusAvain);
            const parsed = raaka ? JSON.parse(raaka) : [];
            return Array.isArray(parsed) ? parsed : [];
        } catch {
            return [];
        }
    }

    function tallennaPyynnot(pyynnot) {
        localStorage.setItem(tallennusAvain, JSON.stringify(pyynnot));
    }

    function naytaTallennetutPyynnot() {
        const pyynnot = haePyynnot();
        listaElementti.innerHTML = "";

        if (pyynnot.length === 0) {
            const tyhjaLi = document.createElement("li");
            tyhjaLi.textContent = "Ei vielä tallennettuja varauspyyntöjä.";
            listaElementti.appendChild(tyhjaLi);
            return;
        }

        pyynnot.forEach((pyynto) => {
            const li = document.createElement("li");
            const lisatietoTeksti = pyynto.viesti ? ` – Lisätiedot: ${pyynto.viesti}` : "";
            li.textContent = `${pyynto.ilta} | ${pyynto.sauna} | ${pyynto.nimi} (${pyynto.puhelin})${lisatietoTeksti}`;
            listaElementti.appendChild(li);
        });
    }

    function tyhjennaVirheet() {
        virheNimi.textContent = "";
        virhePuhelin.textContent = "";
        virheSauna.textContent = "";
        virheIlta.textContent = "";
        lomakeTila.textContent = "";
    }

    lomake.addEventListener("submit", (event) => {
        event.preventDefault();
        tyhjennaVirheet();

        const nimi = nimiInput.value.trim();
        const puhelin = puhelinInput.value.trim();
        const sauna = saunaSelect.value;
        const ilta = iltaInput.value;
        const viesti = viestiInput.value.trim();

        const puhelinNumerot = puhelin.replace(/[^\d+]/g, "");
        let ensimmainenVirheKentta = null;

        if (nimi.length < 2) {
            virheNimi.textContent = "Syötä nimesi (vähintään 2 merkkiä).";
            ensimmainenVirheKentta = ensimmainenVirheKentta || nimiInput;
        }

        if (puhelinNumerot.length < 7) {
            virhePuhelin.textContent = "Syötä kelvollinen puhelinnumero (vähintään 7 numeroa).";
            ensimmainenVirheKentta = ensimmainenVirheKentta || puhelinInput;
        }

        if (!sauna) {
            virheSauna.textContent = "Valitse listalta sauna.";
            ensimmainenVirheKentta = ensimmainenVirheKentta || saunaSelect;
        }

        if (!ilta) {
            virheIlta.textContent = "Valitse ilta päivämääräkentästä.";
            ensimmainenVirheKentta = ensimmainenVirheKentta || iltaInput;
        }

        if (ensimmainenVirheKentta) {
            lomakeTila.textContent = "Tarkista korostetut kentät ennen lähettämistä.";
            ensimmainenVirheKentta.focus();
            return;
        }

        const uusiPyynto = {
            nimi,
            puhelin,
            sauna,
            ilta,
            viesti,
            tallennettu: new Date().toISOString()
        };

        const olemassaOlevat = haePyynnot();
        olemassaOlevat.unshift(uusiPyynto);
        tallennaPyynnot(olemassaOlevat);
        naytaTallennetutPyynnot();

        lomake.reset();
        lomakeTila.textContent = "Varauspyyntö on valmis ja tallennettu selaimeen. Vahvistamme varauksen puhelimitse.";
    });

    tyhjennaNappi.addEventListener("click", () => {
        localStorage.removeItem(tallennusAvain);
        naytaTallennetutPyynnot();
        lomakeTila.textContent = "Tallennetut varauspyynnöt on tyhjennetty.";
    });

    naytaTallennetutPyynnot();
});