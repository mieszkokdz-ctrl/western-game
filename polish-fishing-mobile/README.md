# Polish Fishing — wersja mobilna (Ionic/Capacitor)

Ten folder opakowuje grę `fish-is-very-good.html` jako natywną aplikację
Android (i opcjonalnie iOS) przy pomocy Capacitor (silnika, na którym działa
Ionic). Sama gra jest wczytywana jako statyczna strona w folderze `www/`.

## Wymagania (na Twoim komputerze)

- Node.js 18+ i npm
- [Android Studio](https://developer.android.com/studio) (zawiera Android SDK
  i Gradle) — potrzebne do zbudowania i uruchomienia apki na Androidzie
- Ionic CLI (opcjonalnie, do wygodniejszych komend): `npm i -g @ionic/cli`

W tym środowisku (kontener bez Android SDK) nie da się zbudować gotowego
pliku APK — projekt jest w pełni przygotowany, budowanie trzeba wykonać
lokalnie, tam gdzie masz zainstalowane Android Studio.

## Struktura

- `www/index.html` — kod gry (kopia `fish-is-very-good.html` z głównego repo)
- `capacitor.config.json` — konfiguracja apki (nazwa, appId, kolor tła)
- `android/` — wygenerowany natywny projekt Android (Gradle)

## Jak zbudować i uruchomić

1. Zainstaluj zależności:
   ```bash
   npm install
   ```

2. Jeśli zmienisz coś w `fish-is-very-good.html` w głównym repo, skopiuj
   aktualną wersję do `www/index.html`, a potem zsynchronizuj z projektem
   natywnym:
   ```bash
   cp ../fish-is-very-good.html www/index.html
   npx cap sync android
   ```

3. Otwórz projekt w Android Studio:
   ```bash
   npx cap open android
   ```
   Android Studio pobierze potrzebne zależności Gradle i pozwoli:
   - uruchomić apkę na emulatorze/telefonie (Run ▶),
   - zbudować plik APK (`Build ▸ Build Bundle(s) / APK(s) ▸ Build APK(s)`),
   - podpisać i zbudować wersję do publikacji w Google Play (AAB).

   Alternatywnie z linii poleceń (wymaga ustawionego `ANDROID_HOME`):
   ```bash
   npx cap run android
   ```

## Personalizacja

- **Nazwa i identyfikator apki**: `capacitor.config.json` (`appName`, `appId`).
- **Ikona i splash screen**: domyślne są placeholderowe. Podmień je łatwo
  narzędziem `@capacitor/assets` — patrz
  https://capacitorjs.com/docs/guides/splash-screens-and-icons
- **iOS**: żeby dodać wersję iOS, na komputerze z macOS i Xcode uruchom
  `npx cap add ios`, potem `npx cap open ios`.

## Uwaga o zapisie postępu

Gra zapisuje postęp (monety, wędki, gabloty, serie logowań) w `localStorage`
przeglądarki/WebView. W apce natywnej ten zapis jest lokalny dla urządzenia —
odinstalowanie apki usuwa postęp, tak jak w zwykłej przeglądarce.
