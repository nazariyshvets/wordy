const AuthContextTr = {
  signupUsernameError: {
    "uk-UA":
      "Неприпустиме ім'я користувача (допускаються лише літери, цифри та символи @/./+/-/_) або таке ім'я вже існує.",
    "en-GB":
      "A username is invalid (only letters, numbers, and @/./+/-/_ characters are allowed) or already exists.",
    "de-DE":
      "Der Benutzername ist ungültig (nur Buchstaben, Zahlen und @/./+/-/_ Zeichen sind erlaubt) oder existiert bereits.",
    "fr-FR":
      "Le nom d'utilisateur est invalide (seuls les lettres, les chiffres et les caractères @/./+/-/_ sont autorisés) ou existe déjà.",
    "es-ES":
      "El nombre de usuario no es válido (solo se permiten letras, números y caracteres @/./+/-/_) o ya existe.",
    "pt-PT":
      "O nome de usuário é inválido (apenas letras, números e caracteres @/./+/-/_ são permitidos) ou já existe.",
    "pl-PL":
      "Nazwa użytkownika jest nieprawidłowa (dozwolone są tylko litery, cyfry oraz znaki @/./+/-/_) lub już istnieje.",
  },
  signupEmailError: {
    "uk-UA": "Неприпустимий email або такий email вже існує.",
    "en-GB": "An email is invalid or already exists.",
    "de-DE": "Die E-Mail-Adresse ist ungültig oder existiert bereits.",
    "fr-FR": "L'adresse e-mail est invalide ou existe déjà.",
    "es-ES": "El correo electrónico no es válido o ya existe.",
    "pt-PT": "O email é inválido ou já existe.",
    "pl-PL": "Adres e-mail jest nieprawidłowy lub już istnieje.",
  },
  signupPasswordError: {
    "uk-UA": "Паролі недійсні або не співпадають.",
    "en-GB": "Password fields are invalid or didn't match.",
    "de-DE": "Die Passwörter sind ungültig oder stimmen nicht überein.",
    "fr-FR":
      "Les champs de mot de passe sont invalides ou ne correspondent pas.",
    "es-ES": "Los campos de contraseña no son válidos o no coinciden.",
    "pt-PT": "Os campos de senha são inválidos ou não coincidem.",
    "pl-PL": "Pola hasła są nieprawidłowe lub nie pasują do siebie.",
  },
  somethingWentWrong: {
    "uk-UA": "Виникла помилка. Будь ласка, спробуйте знову.",
    "en-GB": "Something went wrong. Please try again.",
    "de-DE": "Etwas ist schief gelaufen. Bitte versuchen Sie es erneut.",
    "fr-FR": "Quelque chose s'est mal passé. Veuillez réessayer.",
    "es-ES": "Algo salió mal. Por favor, inténtelo de nuevo.",
    "pt-PT": "Algo deu errado. Por favor, tente novamente.",
    "pl-PL": "Coś poszło nie tak. Proszę spróbować ponownie.",
  },
  loginError: {
    "uk-UA":
      "За вказаними обліковими даними активний обліковий запис не знайдено.",
    "en-GB": "No active account found with the given credentials.",
    "de-DE":
      "Es wurde kein aktives Konto mit den angegebenen Anmeldedaten gefunden.",
    "fr-FR":
      "Aucun compte actif trouvé avec les informations d'identification fournies.",
    "es-ES":
      "No se encontró ninguna cuenta activa con las credenciales proporcionadas.",
    "pt-PT": "Nenhuma conta ativa encontrada com as credenciais fornecidas.",
    "pl-PL":
      "Nie znaleziono aktywnego konta o podanych danych uwierzytelniających.",
  },
};

const ModesTr = {
  flashcards: {
    "uk-UA": "Картки",
    "en-GB": "Flashcards",
    "de-DE": "Karteikarten",
    "fr-FR": "Fiches",
    "es-ES": "Tarjetas de memoria",
    "pt-PT": "Cartões de memória",
    "pl-PL": "Fiszki",
  },
  writing: {
    "uk-UA": "Письмо",
    "en-GB": "Writing",
    "de-DE": "Schreiben",
    "fr-FR": "Écriture",
    "es-ES": "Escritura",
    "pt-PT": "Escrita",
    "pl-PL": "Pisanie",
  },
  listening: {
    "uk-UA": "Слухання",
    "en-GB": "Listening",
    "de-DE": "Hören",
    "fr-FR": "Écoute",
    "es-ES": "Escuchar",
    "pt-PT": "Ouvir",
    "pl-PL": "Słuchanie",
  },
  "multiple-choice": {
    "uk-UA": "Вибір зі списку",
    "en-GB": "Multiple Choice",
    "de-DE": "Multiple Choice",
    "fr-FR": "Choix multiple",
    "es-ES": "Elección múltiple",
    "pt-PT": "Múltipla escolha",
    "pl-PL": "Wielokrotny wybór",
  },
  "multiple-match": {
    "uk-UA": "Відповідність",
    "en-GB": "Multiple Match",
    "de-DE": "Multiple Match",
    "fr-FR": "Correspondance multiple",
    "es-ES": "Coincidencia múltiple",
    "pt-PT": "Correspondência múltipla",
    "pl-PL": "Wielokrotne dopasowanie",
  },
};

export { AuthContextTr, ModesTr };
