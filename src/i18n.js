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
      About: "About",
      FilmUpload: "Film upload",
      UsersList: "Users",
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
        "Uzyskasz dostęp do zamówionych treści w dn.",
      NonSubscriberPaymentNavTxt2:
        "możesz odstąpić od umowy o subskrypcję do powyższej daty aby uzyskać bezpłatny zwrot",
      ForMoreInfoVisit: "For more info, visit",
      EUWebsite: "EU website",
      AwaitingAccess: "AwaitingAccess",
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
      ReturnToFilmsList: "Powróć na listę filmów",
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
      About: "O stronie",
      FilmUpload: "Dodaj film",
      UsersList: "Użytkownicy",
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
