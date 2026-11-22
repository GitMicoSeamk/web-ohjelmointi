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