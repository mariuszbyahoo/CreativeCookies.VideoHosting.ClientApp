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
