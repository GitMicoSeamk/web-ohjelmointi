
class Opiskelija:
    def __init__( self, nimi:str, opnro:str): # tämä suoritetaan kun luokasta tehdään olio
        self.nimi:str = nimi
        self.opiskelijanumero:str = opnro
        self.__opintopisteet:int = 0 #yksityinen muuttuja

def lisaa_opintopisteet(self, pisteet:int):
    if pisteet < 7:
        self.opintopisteet += pisteet

def tulosta_opiskelija(self:object) -> str:
    opiskelija = f"{self.nimi} ({self.opiskelijanumero}) {self.opintopisteet} op"
    return opiskelija
opiskelija1 = Opiskelija("Liisa", "k123456") 
opiskelija2 = Opiskelija("Maija", "k654321")
opiskelija2.lisaa_opintopisteet(5)


print(opiskelija1.nimi, opiskelija1.opiskelijanumero, opiskelija1.opintopisteet)
print(opiskelija2.nimi, opiskelija2.opiskelijanumero, opiskelija2.opintopisteet)

'''- nimi
- opiskelijanumero
- opintopisteiden määrä'''