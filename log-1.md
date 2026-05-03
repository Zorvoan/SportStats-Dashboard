#### **Název projektu:**

SportStats Dashboard

#### 

#### **Tým a role:**

Project Manager: Patík

Backend Developer: Jančík, Kůra

Frontend Developer: Poštulka, Zapletal

QA \& Dokumentarista: Zapletal



#### **Specifikace funkcí:**



**Uživatelská část:**



Vyhledávání sportovních výsledků (F1 závody, fotbalové zápasy)

Zobrazení dat z API (výsledky, tabulky, statistiky)

Ukládání oblíbených týmů / jezdců

Historie vyhledávání

Registrace a přihlášení



**Administrace:**

Správa uživatelů

Nastavení API (klíče, limity)

Přehled logů (co uživatelé hledají)

Správa systémových zpráv



#### **API** --- Ergast API





#### Návrh databáze:

**Tabulky:**



**users**

* id
* username
* email
* password 

**favorites**

* id
* user\_id
* item\_id
* typ (F1 / fotbal)

**history**

* id
* user\_id
* search\_query
* date

**logs**

* id
* action
* timestamp

