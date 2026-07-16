import type { LegalSection } from './termsContent';

export const PRIVACY_LAST_UPDATED = '16.07.2026';

export const PRIVACY_SECTIONS: LegalSection[] = [
  {
    title: '1. Administrator danych',
    body:
      'Administratorem danych osobowych przetwarzanych w związku z korzystaniem z aplikacji Watch&Chill jest [Nazwa operatora / imię i nazwisko], [adres], e-mail kontaktowy: [adres e-mail] ("Administrator").',
  },
  {
    title: '2. Jakie dane przetwarzamy',
    body:
      'W ramach Aplikacji przetwarzane mogą być: nazwa użytkownika i podstawowe dane profilu, nagrania wideo i audio utworzone za pomocą funkcji nagrywania, treści publikowane w Aplikacji (opisy, hashtagi), informacje o interakcjach (polubienia, zgłoszenia, zablokowani użytkownicy). W obecnej wersji Aplikacji dane te są przechowywane lokalnie na Twoim urządzeniu i nie są przesyłane na serwery Administratora — w przyszłych wersjach, w miarę dodawania funkcji sieciowych (np. udostępnianie filmów innym użytkownikom), zakres ten może się zmienić, o czym poinformujemy w zaktualizowanej Polityce Prywatności.',
  },
  {
    title: '3. Dostęp do aparatu i mikrofonu',
    body:
      'Aplikacja prosi o dostęp do aparatu i mikrofonu wyłącznie w celu nagrania filmu na Twoje żądanie, gdy korzystasz z funkcji nagrywania. Nagrania nie są wysyłane ani udostępniane bez Twojej wyraźnej akcji publikacji. Możesz cofnąć te uprawnienia w dowolnym momencie w ustawieniach systemowych urządzenia — spowoduje to jedynie brak możliwości nagrywania nowych filmów.',
  },
  {
    title: '4. Podstawy prawne przetwarzania (RODO)',
    body:
      'Dane przetwarzamy na podstawie: art. 6 ust. 1 lit. b RODO — w celu świadczenia usługi (wykonanie umowy o korzystanie z Aplikacji); art. 6 ust. 1 lit. a RODO — Twojej zgody na dostęp do aparatu/mikrofonu oraz akceptację Regulaminu; art. 6 ust. 1 lit. f RODO — prawnie uzasadnionego interesu Administratora w zapewnieniu bezpieczeństwa i moderacji Treści (rozpatrywanie zgłoszeń, przeciwdziałanie nadużyciom).',
  },
  {
    title: '5. Udostępnianie danych',
    body:
      'Nie sprzedajemy danych osobowych. Dane mogą zostać udostępnione podmiotom przetwarzającym dane w imieniu Administratora (np. dostawcom infrastruktury technicznej) wyłącznie w zakresie niezbędnym do świadczenia usługi, a także organom państwowym, gdy wymaga tego obowiązujące prawo.',
  },
  {
    title: '6. Okres przechowywania',
    body:
      'Dane przechowywane lokalnie na urządzeniu są usuwane w momencie odinstalowania Aplikacji lub wyczyszczenia jej danych w ustawieniach systemowych. Możesz też usunąć poszczególne Treści bezpośrednio w Aplikacji, w dowolnym momencie.',
  },
  {
    title: '7. Twoje prawa',
    body:
      'Zgodnie z RODO przysługuje Ci prawo do: dostępu do swoich danych, ich sprostowania, usunięcia („prawo do bycia zapomnianym"), ograniczenia przetwarzania, przenoszenia danych oraz sprzeciwu wobec przetwarzania. Przysługuje Ci również prawo wniesienia skargi do Prezesa Urzędu Ochrony Danych Osobowych (UODO) lub właściwego organu nadzorczego. W celu realizacji swoich praw skontaktuj się z nami: [adres e-mail kontaktowy].',
  },
  {
    title: '8. Bezpieczeństwo danych',
    body:
      'Stosujemy odpowiednie środki techniczne i organizacyjne w celu ochrony danych przed nieuprawnionym dostępem, utratą lub zniszczeniem.',
  },
  {
    title: '9. Pliki cookie i technologie lokalne (wersja webowa)',
    body:
      'W wersji internetowej (PWA) Aplikacja wykorzystuje lokalne mechanizmy przechowywania danych w przeglądarce (m.in. localStorage oraz pamięć podręczną service workera) wyłącznie w celu zapamiętania Twoich ustawień i umożliwienia działania Aplikacji w trybie offline. Nie wykorzystujemy plików cookie do celów reklamowych ani śledzenia użytkowników między stronami.',
  },
  {
    title: '10. Dzieci',
    body:
      'Aplikacja nie jest kierowana do dzieci poniżej 13 roku życia i świadomie nie zbieramy danych osobowych takich osób. Osoby w wieku 13–15 lat mogą korzystać z Aplikacji wyłącznie za zgodą rodzica lub opiekuna prawnego.',
  },
  {
    title: '11. Zmiany Polityki Prywatności',
    body:
      'Możemy okresowo aktualizować niniejszą Politykę Prywatności. O istotnych zmianach poinformujemy w Aplikacji.',
  },
  {
    title: '12. Kontakt',
    body: 'W sprawach związanych z ochroną danych osobowych skontaktuj się z nami: [adres e-mail kontaktowy].',
  },
];
