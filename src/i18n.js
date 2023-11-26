import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: {
      Welcome: "Welcome",
      Email: "Email",
      Role: "Role",
      IsUserActive: "Is user active",
      About: "About",
      FilmsList: "Films",
      Login: "Login",
      Register: "Register",
      LogOut: "Log out",
      FilmsUpload: "Upload film",
      UsersList: "Users list",
      Upload: "Upload",
      UploadANewVideo: "Upload a new video",
      Title: "Title",
      SelectedFile: "Selected file",
      PleaseSelectVideo: "Please select video file",
      SelectMp4File: "Select MP4 file",
      PleaseSelectThumbnail: "Please select thumbnail file",
      SelectJPGFile: "Select JPG file",
      UsedDescriptionLength: "Used description length",
      Characters: "characters",
      TitleIsRequired: "Title is required",
      TitleMustBeAtLeast3Characters: "Title must be at least 3 characters",
      TitleCannotExceed50Characters: "Title cannot exceed 50 characters",
      HowIsDescriptionCounted: "How is description counted",
      DescriptionLengthExplanation: "Description length explanation",
      DescriptionLengthExplanationTxt1:
        "Description is being translated from the editor above into an HTML code, so any stylings will enlarge the amount of used characters",
      DescriptionLengthExplanationTxt2:
        "Max length of a description is 5000 characters",
      DescriptionLengthExplanationTxt3:
        "Generated HTML code of your video's description looks like this",
      DescriptionCannotExceed5000Characters:
        "Description cannot exceed 5000 characters",
      UnexpectedErrorOccured:
        "Unexpected error occured, please contact support",
      Error: "Error",
      VideoUploadedSuccesfully: "Video uploaded succesfully",
      VideoEditedSuccesfully: "Video has been edited succesfully",
      Success: "Success",
      SavingVideoMetadata: "Saving video metadata",
      UploadingVideo: "Uploading video",
      PreparingToUpload: "Preparing to upload",
      ThumbnailImageIsRequiredToSelect: "Thumbnail image is required to select",
      VideoFileIsRequiredToSelect: "Video is required to select",
      OnlyJPGFilesAreAllowed: "Only .jpg files are allowed",
      ValidationError: "Validation error",
      OnlyMP4FilesAreAllowed: "Only .mp4 files are allowed",
      UploadFilmToGetStarted: "Upload a movie to get started",
      ErrorOccuredWhileFetchingFromAPI:
        "An error occured while fetching data from API",
      LoadMore: "Load more",
      AreYouSureWantToDeleteThisVideo:
        "Are you sure you want to delete this video",
      TokenExpired: "Token has expired",
      LoginAgain: "Please Log in again",
      EditingFilm: "Edit film",
      EditVideoMetadata: "Edit video metadata",
      Cancel: "Cancel",
      Confirm: "Potwierdź",
      Close: "Close",
      SomethingWentWrong: "Something went wrong",
      PleaseContactSupportStripeError:
        "Unfortunately, something went wrong with the synchronization between MyHub and Stripe. Please contact support.",
      ProceedTo: "Proceed to",
      SubscriptionsDashboard: "subscriptions dashboard",
      AndCreateANewOne: "and create your first one.",
      VerifyingOnboardingStatus: "Verifying onboarding status, please wait",
      VerificationShouldTake5Minutes:
        "Verification of recently submitted account should take no more than 5 minutes",
      NoPaymentSubmitted: "No payment submitted",
      ReturnToFilmsList: "Return to films list",
      GetAccessToAllVideos: "Get access to all videos",
      Subscribe: "Subscribe",
      StartSupportingCreator:
        "Start supporting your favourite creator each month",
      SelectSubscriptionCurrency: "Select your subscription currency",
      WaiveRightToWithdrawFromContract:
        "I wish to gain access to the ordered services immediately and I waive my right to withdraw from the contract within 14 days. I am aware that I will no longer be able to exercise my right to withdraw from the contract.",
      MembershipActive: "Membership active",
      MembershipActiveDesc:
        "Currently you have active membership. First, you've got to cancel the current subscription or if you already done it - then await for the current billing period to pass before continuing.",
      CurrentlyWithinCoolingOffPeriod:
        "Currently you are within cooling off period of your last order for the future subscription, if you want to change your order terms, then you would have to cancel the previous order, and after that you'll be free to add a new order for membership.",
      WithinCoolingOffPeriod: "Within cooling off period",
      CoolingOffPeriod: "Cooling off period",
      CloseWindow: "Close window",
      WithdrawContract: "Withdraw contract",
      DeleteVideo: "Delete video",
      Search: "Search",
      LoadingUsers: "Loading users",
      Page: "Page",
      Of: "of",
      NextPage: "Next page",
      PreviousPage: "Previous page",
      DownloadJSON: "Download JSON",
      DownloadExcel: "Download Excel",
      PleaseWaitGeneratingFile: "Please wait, generating file",
      Yes: "yes",
      No: "no",
      YourSessionExpired: "Your session have expired",
      PleaseLoginAgain: "Please login again",
      Logout: "Logout",
      AnErrorOccuredDuringAuthentication:
        "An error occurred during authentication",
      Films: "Films",
      FilmUpload: "Film upload",
      OrderCanceled: "Order canceled",
      RefundInitiatedMsg:
        "Refund has been initiated, you should receive your funds within 30 days",
      SubscriptionAlreadyCanceled: "Subscription already canceled",
      SubscriptionAlreadyCanceledMsg:
        "Your subscription has been already canceled, your card won't be charged again.",
      Premium: "Premium",
      BillingPeriodTillMsg:
        "You are a premium member, billing period lasts till",
      CancelSubscription: "Cancel subscription",
      CloseWindow: "Close window",
      Language: "Language",
      SubscriptionCanceledSuccessfully: "Subscription canceled succesfully",
      ErrorCancellingSubscription:
        "Error occured during your subscription cancelation, please contact administrator",
      NonSubscriberPaymentNavTxt1:
        "You will gain access to the ordered content on",
      NonSubscriberPaymentNavTxt2:
        "you can withdraw from the subscription agreement until the above date to receive a free refund",
      ForMoreInfoVisit: "For more info, visit",
      EUWebsite: "EU website",
      AwaitingAccess: "Awaiting access",
      ProcessingPayment: "Processing payment",
      GrantingAfter14Days:
        "Referring to the regulations, you will gain access to the page content after the lapse of the 14-day period allowing for the withdrawal from the contract.",
      ExploreFilms: "Explore films",
      PaymentFailed: "Payment failed",
      PaymentSucceed: "Payment succeeded",
      Price: "Price",
      State: "State",
      Deactivate: "Deactivate",
      Activate: "Activate",
      CreateYourFirstPlan:
        "Create your first subscription plan to start monetizing your videos",
      NoPricesYet: "No prices yet",
      AddANewPrice: "Add a new price",
      SubscriptionPlan: "Subscription plan",
      ProductDescription: "Subscription plan description",
      ProcessingProduct: "Processing subscription plan",
      ProductNameRequired: "Product name is required",
      ProductNameAtLeast5Chars: "Product name requires at least 5 characters",
      ProductNameAtMost50Chars:
        "Product name requires no more than 50 characters",
      ProductTitle: "Product title",
      Amount: "Amount",
      AmountIsRequired: "Amount is required",
      AmountNotLessThan: "Amount not less than",
      Currency: "Currency",

      CompanyAddressDesc:
        "Review your company's address, and the Tax related data",
      CompanyNameIsRequied: "Company name is required",
      CompanyNameNotLessThan3Chars:
        "Company name must be at least 3 characters long",
      TaxIdNotLessThan3Chars: "Tax ID must be at least 3 characters long",
      CompanyName: "Company name",
      TaxIdRequired: "Tax id is required",
      InvalidLastName: "Invalid last name",
      CompanyTaxId: "Company Tax ID",
      IsCompanyVATExempt: "Is company VAT Exempt",
      StreetIsRequired: "Street is required",
      StreetAtLeast3CharsLong: "Street must be at least 3 characters long",
      InvalidStreetName: "Invalid street name",
      Street: "Street",
      HouseNumberIsRequired: "House number is required",
      InvalidHouseNumber: "Invalid house number",
      HouseNumber: "House number",
      AppartmentNumberReqErrorMsg: "Apartment number must be greater than zero",
      AppartmentNumberLghErrorMsg:
        "Invalid apartment number. Only numbers greater than zero are allowed.",
      AppartmentNumber: "Appartment number",
      PostCodeReq: "Post code is required",
      PostCodeFormat: "Post code must be in the format XX-XXX",
      PostCode: "Post code",
      CityIsReq: "City is required",
      CityLengthMsg: "City name must be at least 3 characters long",
      CityFormat: "Invalid city name",
      City: "City",
      Country: "Country",
      CountryReq: "Country is required",
      SaveCompanyData: "Save company data",
      MerchantAddressUpserted: "Merchant address saved",
      DataUnchanged: "Data unchanged",
      MerchantAddressHasNotBeenAltered:
        "Merchant's address has not been altered",
      FirstName: "First name",
      LastName: "Last name",
      FirstNameAtLeast3Chars: "First name must be at least 3 characters long",
      FirstNameRequired: "First name is required",
      InvalidFirstName: "Invalid first name",
      LastNameAtLeast3Chars: "Last name must be at least 3 characters long",
      LastNameRequired: "Last name is required",
      InvalidLastName: "Invalid last name",
      AddressMsg: "Above address will be used to generate valid VAT invoice",
      InvoiceAddressMsg: "Invoice address",
      Accept: "Accept",
      CookieConsentTxt:
        "We respect your privacy and highly value transparent processing of your data. This site uses cookies to ensure a secure login process, remember your preferences, and protect against CSRF attacks. You can block our cookies through your browser settings.",
      EditRegulations: "Edit regulations",
      UpdateRegulations: "Update",
      RegulationsEditedSuccesfully: "Regulations edited succesfully",
      EditPrivacyPolicy: "Edit privacy policy",
      UpdatePrivacyPolicy: "Edit",
      PrivacyPolicyEditedSuccesfully: "Privacy policy edited succesfully",
      LinkedinAccount: "about the author",
      PrivacyPolicy: "Privacy policy",
      Regulations: "Regulations",
      YouWantSuchAWebsite: "Would you like to have such a website?",
      EditAboutPage: "Edit about page",
      UpdateAboutPage: "Update",
      AboutPageEditedSuccessfully: "About page edited successfully",
      Contact: "Contact",
    },
  },
  pl: {
    translation: {
      Welcome: "Witaj",
      Email: "E-mail",
      Role: "Rola",
      IsUserActive: "Czy użytkownik jest aktywny",
      About: "O stronie",
      FilmsList: "Filmy",
      Login: "Logowanie",
      Register: "Rejestracja",
      LogOut: "Wylogowanie",
      FilmUpload: "Dodaj film",
      UsersList: "Użytkownicy",
      Upload: "Załaduj",
      UploadANewVideo: "Dodaj nowy film",
      Title: "Tytuł",
      SelectedFile: "Wybrany plik",
      PleaseSelectVideo: "Proszę wybrać plik video",
      SelectMP4File: "Wybierz plik MP4",
      PleaseSelectThumbnail: "Proszę wybrać plik okładki",
      SelectJPGFile: "Wybierz plik JPG",
      UsedDescriptionLength: "Zużyta długość opisu",
      Characters: "znaków",
      TitleIsRequired: "Tytuł jest wymagany",
      TitleMustBeAtLeast3Characters: "Tytuł musi być dłuższy niż 3 znaki",
      TitleCannotExceed50Characters: "Tytuł nie może przekroczyć 50 znaków",
      HowIsDescriptionCounted: "Jak jest przeliczana długość opisu",
      DescriptionLengthExplanation: "Objaśnienie długości opisu",
      DescriptionLengthExplanationTxt1:
        "Wpisywany opis jest od razu tłumaczony na kod HTML, więc jakiekolwiek style powiększą ilość zużytych znaków",
      DescriptionLengthExplanationTxt2:
        "Maksymalna długość opisu filmu to 5000 znaków",
      DescriptionLengthExplanationTxt3:
        "Wygenerowany kod HTML z opisem Twojego filmu wygląda następująco",
      DescriptionCannotExceed5000Characters:
        "Opis nie może przekroczyć 5000 znaków",
      UnexpectedErrorOccured:
        "Wystąpił niespodziewany błąd, skontaktuj się z dostawcą",
      Error: "Błąd",
      VideoUploadedSuccesfully: "Poprawnie wysłano film",
      VideoEditedSuccesfully: "Poprawnie zedytowano film",
      Success: "Sukces",
      SavingVideoMetadata: "Zapisywanie metadata filmu",
      UploadingVideo: "Wysyłanie filmu",
      PreparingToUpload: "Przygotowanie do wysłania filmu",
      ThumbnailImageIsRequiredToSelect: "Należy wybrać plik okładki",
      VideoFileIsRequiredToSelect: "Należy wybrać plik video",
      OnlyJPGFilesAreAllowed: "Dopuszczalne są tylko pliki .jpg",
      ValidationError: "Błąd walidacji",
      OnlyMP4FilesAreAllowed: "Dopuszczalne są tylko pliki .mp4",
      UploadFilmToGetStarted: "Dodaj film aby rozpocząć",
      ErrorOccuredWhileFetchingFromAPI:
        "Wystąpił błąd podczas zaciągania filmów z API",
      LoadMore: "Załaduj więcej",
      AreYouSureWantToDeleteThisVideo: "Czy na pewno chcesz usunąć ten film",
      TokenExpired: "Twój Token wygasł",
      LoginAgain: "Proszę zalogować się ponownie",
      EditingFilm: "Edycja filmu",
      EditVideoMetadata: "Edycja metadata filmu",
      Cancel: "Anuluj",
      Confirm: "Potwierdź",
      Close: "Zamknij",
      SomethingWentWrong: "Coś poszło nie tak",
      PleaseContactSupportStripeError:
        "Niestety, coś poszło nie tak z synchronizacją pomiędzy MyHub a Stripe, prosze skontaktować się z dostawcą.",
      ProceedTo: "Przejdź do",
      SubscriptionsDashboard: "panelu subskrypcji",
      VerifyingOnboardingStatus:
        "Weryfikuję status onboardingu Stripe, proszę czekać",
      VerificationShouldTake5Minutes:
        "Weryfikacja dopiero co wysłanych informacji powinna zająć nie więcej niż 5 minut",
      NoPaymentSubmitted: "Nie dokonano płatności",
      Subscribe: "Subskrybuj",
      GetAccessToAllVideos: "Uzyskaj dostęp do wszystkich filmów",
      StartSupportingCreator:
        "Zacznij wspierać ulubionego Twórcę każdego miesiąca",
      SelectSubscriptionCurrency: "Wybierz walutę subskrypcji",
      WaiveRightToWithdrawFromContract:
        "Chcę otrzymać dostęp do zamówionych usług już teraz i rezygnuję z prawa do odstąpienia od umowy w terminie 14 dni. Mam świadomość, że nie będę mógł już skorzystać z prawa do odstąpienia od umowy.",
      MembershipActive: "Aktywne członkostwo",
      MembershipActiveDesc:
        "Obecnie jesteś aktywnym członkiem. Wpierw, anuluj swoją subskrypcję lub jeśli już to zrobiłeś - odczekaj do końca okresu rozliczeniowego aby kontynuować.",
      CurrentlyWithinCoolingOffPeriod:
        "Obecnie jesteś w trakcie okresu pozwalającego na wypowiedzenie umowy ostatniego zamówienia, jeśli chcesz zmienić warunki, najpierw anuluj poprzednie zamówienie, a potem będziesz mógł stworzyć nowe na innych warunkach",
      WithinCoolingOffPeriod: "W trakcie okresu oczekiwania",
      CoolingOffPeriod: "Okres na odstąpienie od umowy",
      CloseWindow: "Zamknij okno",
      WithdrawContract: "Odstąp od umowy",
      DeleteVideo: "Usuń film",
      Search: "Wyszukaj",
      LoadingUsers: "Ładowanie użytkowników",
      Page: "Strona",
      Of: "z",
      NextPage: "Następna strona",
      PreviousPage: "Poprzednia strona",
      DownloadJSON: "Ściągnij plik JSON",
      DownloadExcel: "Ściągnij plik Excel",
      PleaseWaitGeneratingFile: "Proszę czekać, generuję plik",
      Yes: "tak",
      No: "nie",
      YourSessionExpired: "Twoja sesja wygasła",
      PleaseLoginAgain: "Proszę zalogować się ponownie",
      Logout: "Wyloguj",
      AnErrorOccuredDuringAuthentication: "Wystąpił błąd w trakcie logowania",
      Films: "Filmy",
      OrderCanceled: "Anulowano zamówienie",
      RefundInitiatedMsg:
        "Zlecono zwrot pieniędzy, powinieneś je otrzymać w terminie 30 dni",
      SubscriptionAlreadyCanceled: "Subskrypcja anulowana",
      SubscriptionAlreadyCanceledMsg:
        "Subskrypcja została anulowana, Twoja karta nie zostanie ponownie obciążona",
      Premium: "Premium",
      BillingPeriodTillMsg:
        "Jesteś użytkownikiem premium, okres rozliczeniowy upływa",
      CancelSubscription: "Anuluj subskrypcję",
      CloseWindow: "Zamknij okno",
      Language: "Język",
      SubscriptionCanceledSuccessfully: "Subskrypcja poprawnie anulowana",
      ErrorCancellingSubscription:
        "Wystąpił błąd podczas anulowania subskrypcji, proszę skontaktować się z dostawcą",
      NonSubscriberPaymentNavTxt1:
        "Uzyskasz dostęp do zamówionych treści w dn.",
      NonSubscriberPaymentNavTxt2:
        "możesz odstąpić od umowy o subskrypcję do powyższej daty aby uzyskać bezpłatny zwrot",
      ForMoreInfoVisit: "Po więcej informacji, odwiedź",
      EUWebsite: "stronę UE",
      AwaitingAccess: "Oczekuje na dostęp",
      ProcessingPayment: "Procesowanie płatności",
      GrantingAfter14Days:
        "Nawiązując do regulaminu otrzymasz dostęp do zawartości strony po upłynięciu 14 dni okresu pozwalającego na odstąpienie od umowy.",
      ExploreFilms: "Przeglądaj filmy",
      PaymentFailed: "Płatność nie powiodła się",
      PaymentSucceed: "Płatność powiodła się",
      ReturnToFilmsList: "Powróć na listę filmów",
      Price: "Cena",
      State: "Stan",
      Deactivate: "Dezaktywuj",
      Activate: "Aktywuj",
      CreateYourFirstPlan:
        "Utwórz pierwszą subskrypcję aby rozpocząć monetyzację filmów",
      NoPricesYet: "Nie ma jeszcze żadnych cen",
      AddANewPrice: "Dodaj nową cenę",
      SubscriptionPlan: "Subskrypcja",
      ProductDescription: "Opis planu subskrypcji",
      ProcessingProduct: "Przetwarzanie produktu",
      ProductNameRequired: "Nazwa planu subskrypcyjnego jest wymagana",
      ProductNameAtLeast5Chars: "Nazwa planu musi mieć co najmniej 5 znaków",
      ProductNameAtMost50Chars: "Nazwa planu musi mieć co najwyżej 50 znaków",
      ProductTitle: "Nazwa planu subskrypcyjnego",
      Amount: "Liczba",
      AmountIsRequired: "Liczba jest wymagana",
      AmountNotLessThan: "Liczba nie mniejsza niż",
      Currency: "Waluta",
      CompanyAddressDesc:
        "Przejrzyj adres swojej firmy i dane związane z podatkami",
      CompanyNameIsRequied: "Nazwa firmy jest wymagana",
      CompanyNameNotLessThan3Chars: "Nazwa firmy musi mieć co najmniej 3 znaki",
      TaxIdNotLessThan3Chars:
        "Identyfikator podatkowy musi mieć co najmniej 3 znaki",
      CompanyName: "Nazwa firmy",
      TaxIdRequired: "Wymagany jest identyfikator podatkowy",
      InvalidLastName: "Nieprawidłowe nazwisko",
      CompanyTaxId: "Identyfikator podatkowy",
      IsCompanyVATExempt: "Zwolniona z VAT",
      StreetIsRequired: "Ulica jest wymagana",
      StreetAtLeast3CharsLong: "Ulica musi mieć co najmniej 3 znaki",
      InvalidStreetName: "Nieprawidłowa nazwa ulicy",
      Street: "Ulica",
      HouseNumberIsRequired: "Numer domu jest wymagany",
      InvalidHouseNumber: "Nieprawidłowy numer domu",
      HouseNumber: "Numer domu",
      AppartmentNumberReqErrorMsg: "Numer mieszkania musi być większy od zera",
      AppartmentNumberLghErrorMsg:
        "Nieprawidłowy numer mieszkania. Dozwolone są tylko liczby większe od zera.",
      AppartmentNumber: "Numer mieszkania",
      PostCodeReq: "Kod pocztowy jest wymagany",
      PostCodeFormat: "Kod pocztowy musi być w formacie XX-XXX",
      PostCode: "Kod pocztowy",
      CityIsReq: "Miasto jest wymagane",
      CityLengthMsg: "Nazwa miasta musi mieć co najmniej 3 znaki",
      CityFormat: "Nieprawidłowa nazwa miasta",
      City: "Miasto",
      Country: "Kraj",
      CountryReq: "Kraj jest wymagany",
      SaveCompanyData: "Zapisz dane firmy",
      MerchantAddressUpserted: "Zapisano poprawnie nowe dane sprzedawcy",
      DataUnchanged: "Dane niezmienione",
      MerchantAddressHasNotBeenAltered: "Adres sprzedawcy pozostał bez zmian",
      FirstName: "Imię",
      LastName: "Nazwisko",
      FirstNameAtLeast3Chars: "Imię nie krótsze niż 3 znaki",
      FirstNameRequired: "Imię jest wymagane",
      InvalidFirstName: "Niewłaściwe imię",
      LastNameAtLeast3Chars: "Nazwisko nie krótsze niż 3 znaki",
      LastNameRequired: "Nazwisko jest wymagane",
      InvalidLastName: "Niewłaściwe nazwisko",
      AddressMsg:
        "Powyższy adres zostanie użyty do wygenerowania poprawnej faktury VAT",
      InvoiceAddressMsg: "Adres do faktury",
      Accept: "Akceptuję",
      CookieConsentTxt:
        "Szanujemy Twoją prywatność i przywiązujemy wielką wagę do przejrzystego przetwarzania Twoich danych. Ta strona używa plików cookie w celu zapewnienia bezpiecznego procesu logowania, zapamiętywania Twoich preferencji, oraz ochrony przed atakami CSRF. Możesz zablokować nasze ciasteczka poprzez ustawienia swojej przeglądarki.",
      EditRegulations: "Edycja regulaminu",
      UpdateRegulations: "Zmień",
      RegulationsEditedSuccesfully: "Poprawnie zmieniono regulamin",
      EditPrivacyPolicy: "Edycja polityki prywatności",
      UpdatePrivacyPolicy: "Zmień",
      PrivacyPolicyEditedSuccesfully:
        "Poprawnie zmieniono politykę prywatności",
      LinkedinAccount: "o autorze",
      PrivacyPolicy: "Polityka Prywatności",
      Regulations: "Regulamin",
      YouWantSuchAWebsite: "Chciałbyś taką stronę",
      EditAboutPage: "Edytuj stronę o kanale",
      UpdateAboutPage: "Zmień",
      AboutPageEditedSuccessfully:
        "Strona o kanale została poprawnie zmieniona",
      Contact: "Kontakt",
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: "pl", // set the default language to Polish
  fallbackLng: "en",
  interpolation: {
    escapeValue: false, // react is already safe from XSS
  },
});

export default i18n;
