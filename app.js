// State management for IRIS Pay Demo Widget
const state = {
  selectedCountry: 'bg',
  selectedBank: null,
  selectedMethod: 'iris', // 'card', 'transfer', 'cod', 'iris'
  step: 'checkout-select', // 'checkout-select', 'bank-list', 'bank-confirm', 'bank-portal', 'success'
  timerSeconds: 240, // 4 minutes timer
  timerInterval: null,
  lang: 'bg',
  amount: 30.00, // Updated price: 30 EUR
  currency: 'EUR',
  merchantName: 'Iris Solutions',
  paymentDescription: 'IRIS-1042: Premium Navy Hoodie',
  paymentDate: ''
};

// Flags SVGs
const flags = {
  bg: `<svg viewBox="0 0 60 40"><rect width="60" height="13.3" fill="#fff"/><rect y="13.3" width="60" height="13.3" fill="#009639"/><rect y="26.6" width="60" height="13.4" fill="#d62612"/></svg>`,
  ro: `<svg viewBox="0 0 60 40"><rect width="20" height="40" fill="#002B7F"/><rect x="20" width="20" height="40" fill="#FCD116"/><rect x="40" width="20" height="40" fill="#CE1126"/></svg>`,
  gr: `<svg viewBox="0 0 60 40"><rect width="60" height="40" fill="#0D5EAF"/><rect y="4.4" width="60" height="4.4" fill="#fff"/><rect y="13.3" width="60" height="4.4" fill="#fff"/><rect y="22.2" width="60" height="4.4" fill="#fff"/><rect y="31.1" width="60" height="4.4" fill="#fff"/><rect width="22" height="22" fill="#0D5EAF"/><rect x="8.8" width="4.4" height="22" fill="#fff"/><rect y="8.8" width="22" height="4.4" fill="#fff"/></svg>`,
  hr: `<svg viewBox="0 0 60 40"><rect width="60" height="13.3" fill="#FF0000"/><rect y="13.3" width="60" height="13.3" fill="#FFFFFF"/><rect y="26.6" width="60" height="13.4" fill="#0000FF"/><g transform="translate(24, 11) scale(0.65)"><rect x="0" y="0" width="4" height="4" fill="#FF0000"/><rect x="4" y="0" width="4" height="4" fill="#FFFFFF"/><rect x="8" y="0" width="4" height="4" fill="#FF0000"/><rect x="0" y="4" width="4" height="4" fill="#FFFFFF"/><rect x="4" y="4" width="4" height="4" fill="#FF0000"/><rect x="8" y="4" width="4" height="4" fill="#FFFFFF"/><rect x="0" y="8" width="4" height="4" fill="#FF0000"/><rect x="4" y="8" width="4" height="4" fill="#FFFFFF"/><rect x="8" y="8" width="4" height="4" fill="#FF0000"/></g></svg>`,
  cy: `<svg viewBox="0 0 60 40" style="background-color: white;"><path d="M22 15 Q26 12 32 12 Q38 12 38 16 Q36 18 34 20 Q30 22 28 20 Z" fill="#D47000"/><path d="M22 24 C26 26 34 26 38 24" fill="none" stroke="#4E5D30" stroke-width="2"/></svg>`,
  it: `<svg viewBox="0 0 60 40"><rect width="20" height="40" fill="#009246"/><rect x="20" width="20" height="40" fill="#F1F2F1"/><rect x="40" width="20" height="40" fill="#CE2B37"/></svg>`
};

// Bank Data
const banks = [
  {
    id: 'revolut',
    name: 'Revolut',
    countries: ['bg', 'ro', 'gr', 'hr', 'cy', 'it'],
    logo: `<svg viewBox="0 0 120 30" class="bank-logo" width="100%" height="100%"><text x="10" y="23" font-family="'Manrope', sans-serif" font-weight="900" font-size="20" fill="#000" letter-spacing="0.05em">Revolut</text></svg>`
  },
  {
    id: 'unicredit',
    name: 'UniCredit Bulbank',
    countries: ['bg', 'ro', 'it'],
    logo: `<svg viewBox="0 0 180 40" class="bank-logo" width="100%" height="100%"><circle cx="20" cy="20" r="16" fill="#e30613"/><path d="M15 25 L18 13 L22 13 L21 25 Z" fill="#fff"/><path d="M14 15 C16 12, 20 12, 23 15" fill="none" stroke="#fff" stroke-width="2.5"/><text x="45" y="24" font-family="'Manrope', sans-serif" font-weight="800" font-size="14" fill="#000">UniCredit</text><text x="45" y="34" font-family="'Manrope', sans-serif" font-weight="400" font-size="10" fill="#5e667e">Bulbank</text></svg>`
  },
  {
    id: 'dsk',
    name: 'Банка ДСК',
    countries: ['bg'],
    logo: `<svg viewBox="0 0 160 40" class="bank-logo" width="100%" height="100%"><circle cx="20" cy="20" r="14" fill="#009639"/><rect x="13" y="13" width="14" height="14" fill="#fff"/><circle cx="20" cy="20" r="4" fill="#009639"/><text x="42" y="24" font-family="'Manrope', sans-serif" font-weight="800" font-size="13" fill="#009639">банка ДСК</text><text x="42" y="34" font-family="'Manrope', sans-serif" font-weight="400" font-size="8" fill="#5e667e">otp group</text></svg>`
  },
  {
    id: 'ubb',
    name: 'ОББ',
    countries: ['bg'],
    logo: `<svg viewBox="0 0 140 40" class="bank-logo" width="100%" height="100%"><rect x="5" y="5" width="30" height="30" rx="4" fill="#005B94"/><path d="M12 25 L12 18 L16 14 L20 14 L24 18 L24 25 Z" fill="#fff"/><circle cx="18" cy="21" r="2" fill="#005B94"/><text x="45" y="26" font-family="'Manrope', sans-serif" font-weight="900" font-size="20" fill="#005B94">ОББ</text></svg>`
  },
  {
    id: 'postbank',
    name: 'Postbank',
    countries: ['bg'],
    logo: `<svg viewBox="0 0 150 40" class="bank-logo" width="100%" height="100%"><rect x="5" y="5" width="30" height="30" rx="15" fill="#de1c24"/><text x="14" y="26" font-family="'Manrope', sans-serif" font-weight="900" font-size="18" fill="#fff">P</text><text x="45" y="25" font-family="'Manrope', sans-serif" font-weight="800" font-size="18" fill="#0f1c3f">Postbank</text></svg>`
  },
  {
    id: 'ccb',
    name: 'Централна Кооперативна Банка',
    countries: ['bg'],
    logo: `<svg viewBox="0 0 170 40" class="bank-logo" width="100%" height="100%"><rect x="5" y="8" width="30" height="24" rx="4" fill="#0054a6"/><text x="8" y="25" font-family="'Manrope', sans-serif" font-weight="800" font-size="12" fill="#fff">ccb</text><text x="42" y="20" font-family="'Manrope', sans-serif" font-weight="800" font-size="12" fill="#0054a6">Централна</text><text x="42" y="30" font-family="'Manrope', sans-serif" font-weight="400" font-size="9" fill="#0054a6">Кооперативна Банка</text></svg>`
  },
  {
    id: 'ibank',
    name: 'iBank',
    countries: ['bg'],
    logo: `<svg viewBox="0 0 140 40" class="bank-logo" width="100%" height="100%"><text x="10" y="26" font-family="'Manrope', sans-serif" font-weight="800" font-size="24" fill="#de1c24">i</text><text x="20" y="26" font-family="'Manrope', sans-serif" font-weight="800" font-size="24" fill="#1b2030">bank</text></svg>`
  },
  {
    id: 'allianz',
    name: 'Allianz',
    countries: ['bg', 'gr', 'hr', 'it'],
    logo: `<svg viewBox="0 0 150 40" class="bank-logo" width="100%" height="100%"><circle cx="20" cy="20" r="14" fill="#003789"/><path d="M14 26 L14 16 A3 3 0 0 1 17 13 L17 26 Z M20 26 L20 14 L20 26 Z M23 26 L23 16 A3 3 0 0 1 26 13 L26 26 Z" fill="#fff" stroke="#fff" stroke-width="1.5"/><text x="42" y="26" font-family="'Manrope', sans-serif" font-weight="800" font-size="18" fill="#003789">Allianz</text></svg>`
  },
  {
    id: 'assetbank',
    name: 'International Asset Bank',
    countries: ['bg'],
    logo: `<svg viewBox="0 0 180 40" class="bank-logo" width="100%" height="100%"><circle cx="18" cy="20" r="12" fill="#0d47a1"/><circle cx="18" cy="20" r="6" fill="#fff"/><text x="38" y="18" font-family="'Manrope', sans-serif" font-weight="800" font-size="10" fill="#0d47a1">INTERNATIONAL</text><text x="38" y="28" font-family="'Manrope', sans-serif" font-weight="800" font-size="11" fill="#1b2030">ASSET BANK</text></svg>`
  },
  {
    id: 'procredit',
    name: 'ProCredit Bank',
    countries: ['bg'],
    logo: `<svg viewBox="0 0 170 40" class="bank-logo" width="100%" height="100%"><circle cx="15" cy="20" r="10" fill="none" stroke="#f57c00" stroke-width="3"/><circle cx="23" cy="20" r="10" fill="none" stroke="#388e3c" stroke-width="3"/><text x="42" y="25" font-family="'Manrope', sans-serif" font-weight="800" font-size="15" fill="#0d47a1">ProCredit Bank</text></svg>`
  },
  {
    id: 'dbank',
    name: 'D Bank',
    countries: ['bg'],
    logo: `<svg viewBox="0 0 140 40" class="bank-logo" width="100%" height="100%"><path d="M5 8 L18 8 C25 8 30 13 30 20 C30 27 25 32 18 32 L5 32 Z" fill="#ffb300"/><path d="M10 13 L16 13 C20 13 24 16 24 20 C24 24 20 27 16 27 L10 27 Z" fill="#fff"/><text x="36" y="26" font-family="'Manrope', sans-serif" font-weight="800" font-size="20" fill="#0d47a1">D Bank</text></svg>`
  },
  {
    id: 'paysera',
    name: 'Paysera',
    countries: ['bg'],
    logo: `<svg viewBox="0 0 140 40" class="bank-logo" width="100%" height="100%"><path d="M8 8 L18 8 C23 8 26 11 26 15 C26 19 23 22 18 22 L14 22 L14 32 L8 32 Z" fill="#00b0ff"/><circle cx="17" cy="15" r="3" fill="#8bc34a"/><text x="35" y="26" font-family="'Manrope', sans-serif" font-weight="800" font-size="20" fill="#0f1c3f">paysera</text></svg>`
  },
  {
    id: 'bacb',
    name: 'Българо-Американска Кредитна Банка',
    countries: ['bg'],
    logo: `<svg viewBox="0 0 180 40" class="bank-logo" width="100%" height="100%"><rect x="5" y="8" width="30" height="24" rx="3" fill="#00796b"/><path d="M12 14 L22 14 M12 20 L22 20 M12 26 L22 26" stroke="#fff" stroke-width="2"/><text x="42" y="16" font-family="'Manrope', sans-serif" font-weight="800" font-size="8" fill="#00796b">БЪЛГАРО-</text><text x="42" y="25" font-family="'Manrope', sans-serif" font-weight="800" font-size="8" fill="#1b2030">АМЕРИКАНСКА</text><text x="42" y="34" font-family="'Manrope', sans-serif" font-weight="800" font-size="8" fill="#1b2030">КРЕДИТНА БАНКА</text></svg>`
  },
  {
    id: 'icard',
    name: 'iCard POS',
    countries: ['bg'],
    logo: `<svg viewBox="0 0 140 40" class="bank-logo" width="100%" height="100%"><circle cx="18" cy="20" r="12" fill="#00a2db"/><text x="11" y="24" font-family="'Manrope', sans-serif" font-weight="800" font-size="10" fill="#fff">iCard</text><rect x="36" y="8" width="22" height="24" rx="3" fill="none" stroke="#1b2030" stroke-width="2"/><rect x="42" y="24" width="10" height="4" fill="#1b2030"/><text x="64" y="25" font-family="'Manrope', sans-serif" font-weight="700" font-size="14" fill="#1b2030">POS</text></svg>`
  },
  {
    id: 'easypay',
    name: 'EasyPay',
    countries: ['bg'],
    logo: `<svg viewBox="0 0 140 40" class="bank-logo" width="100%" height="100%"><rect x="5" y="5" width="110" height="30" rx="6" fill="#e30613"/><text x="14" y="25" font-family="'Manrope', sans-serif" font-weight="800" font-size="14" fill="#fff" letter-spacing="0.05em">Easy</text><text x="74" y="25" font-family="'Manrope', sans-serif" font-weight="800" font-size="14" fill="#fff" letter-spacing="0.05em">Pay</text></svg>`
  },
  {
    id: 'ebury',
    name: 'Ebury',
    countries: ['bg', 'ro', 'gr', 'it'],
    logo: `<svg viewBox="0 0 140 40" class="bank-logo" width="100%" height="100%"><text x="15" y="26" font-family="'Manrope', sans-serif" font-weight="900" font-size="22" fill="#00227a">Ebury</text></svg>`
  }
];

// Complete 6-Language Translation Mappings (BG, EN, RO, HR, GR, IT)
const translations = {
  bg: {
    heroSubtitle: 'IRIS Pay прави приемането на плащания бързо, сигурно и с до 60% по-малко разходи. Ние създаваме бъдещето на дигиталните разплащания.',
    startNow: 'Започни сега',
    checkoutTitle: 'Изберете метод на плащане',
    checkoutSubtitle: 'Моля, изберете предпочитания начин за плащане на Вашата поръчка.',
    methodCard: 'Плащане с карта',
    methodTransfer: 'Банков превод',
    methodCod: 'Наложен платеж',
    methodIris: 'Плати с IRIS Pay',
    alertMessage: 'Това е демонстрация на плащане през IRIS Pay. Моля, изберете платежния метод с логото на IRIS Pay, за да продължите демото.',
    title: 'Държава на банковата сметка',
    chooseBank: 'Изберете Вашата банка',
    chooseBankSubtitle: 'Когато изберете банката си, ще бъдете пренасочени към нейното приложение.',
    selectedBank: 'Избрана банка:',
    selectOtherBank: 'Изберете друга банка',
    instructions: 'Моля, следвайте инструкциите след като бъдете пренасочени към системата на {bank}. Чрез натискането на бутона "Продължи" ще инициирате плащане от избрания от Вас доставчик на платежни услуги, съгласно параметрите посочени по-горе. Със същото действие приемате <a href="#">Общите условия</a>, <a href="#">Политиката за поверителност</a> и <a href="#">Правилата на действащата промоционална кампания</a> на Айрис Солюшънс АД.',
    continue: 'Продължи',
    sessionExpires: 'Сесията ще изтече след:',
    successTitle: 'Плащането е успешно!',
    successDesc: 'Вашата трансакция беше инициирана и потвърдена успешно през Вашата банкова сметка.',
    receiptMerchant: 'Търговец:',
    receiptBank: 'Банка:',
    receiptDate: 'Дата:',
    receiptRef: 'Референтен №:',
    receiptAmount: 'Сума:',
    backHome: 'Ново плащане',
    bankPortalTitle: 'Потвърждение на плащането',
    bankPortalDesc: 'Моля, потвърдете трансакцията към {merchant}.',
    bankPortalConfirm: 'Потвърди плащането',
    bankPortalCancel: 'Откажи плащането',
    merchantLabel: 'Търговец:',
    amountLabel: 'Сума:',
    description: 'Описание:',
    date: 'Дата:',
    storeHeader: 'Тестов магазин',
    productTitle: 'Premium Navy Hoodie',
    productSize: 'Размер: L',
    productQty: 'Количество: 1',
    subtotalLabel: 'Междинна сума',
    shippingLabel: 'Доставка',
    shippingVal: 'Безплатна',
    totalLabel: 'Общо'
  },
  en: {
    heroSubtitle: 'IRIS Pay makes accepting payments fast, secure, and up to 60% less expensive. We build the future of digital payments.',
    startNow: 'Get Started',
    checkoutTitle: 'Choose Payment Method',
    checkoutSubtitle: 'Please select your preferred payment method to complete the order.',
    methodCard: 'Card Payment',
    methodTransfer: 'Bank Transfer',
    methodCod: 'Cash on Delivery',
    methodIris: 'Pay with IRIS Pay',
    alertMessage: 'This is a demo of IRIS Pay. Please select the payment method with the IRIS Pay logo to continue.',
    title: 'Bank account country',
    chooseBank: 'Select your bank',
    chooseBankSubtitle: 'When you choose your bank, you will be redirected to its application.',
    selectedBank: 'Selected bank:',
    selectOtherBank: 'Select another bank',
    instructions: 'Please follow the instructions after you are redirected to the system of {bank}. By clicking the "Continue" button, you will initiate a payment from your selected payment service provider, in accordance with the parameters specified above.',
    continue: 'Continue',
    sessionExpires: 'Session expires in:',
    successTitle: 'Payment Successful!',
    successDesc: 'Your transaction was successfully initiated and confirmed through your bank account.',
    receiptMerchant: 'Merchant:',
    receiptBank: 'Bank:',
    receiptDate: 'Date:',
    receiptRef: 'Reference No:',
    receiptAmount: 'Amount:',
    backHome: 'New Payment',
    bankPortalTitle: 'Payment Confirmation',
    bankPortalDesc: 'Please confirm the transaction to {merchant}.',
    bankPortalConfirm: 'Confirm Payment',
    bankPortalCancel: 'Cancel Payment',
    merchantLabel: 'Merchant:',
    amountLabel: 'Amount:',
    description: 'Description:',
    date: 'Date:',
    storeHeader: 'Demo Store',
    productTitle: 'Premium Navy Hoodie',
    productSize: 'Size: L',
    productQty: 'Quantity: 1',
    subtotalLabel: 'Subtotal',
    shippingLabel: 'Shipping',
    shippingVal: 'Free',
    totalLabel: 'Total'
  },
  ro: {
    heroSubtitle: 'IRIS Pay face acceptarea plăților rapidă, sigură și cu până la 60% mai ieftină. Creăm viitorul plăților digitale.',
    startNow: 'Începe acum',
    checkoutTitle: 'Alegeți metoda de plată',
    checkoutSubtitle: 'Vă rugăm să selectați metoda de plată preferată pentru a finaliza comanda.',
    methodCard: 'Plată cu card',
    methodTransfer: 'Transfer bancar',
    methodCod: 'Plată la livrare',
    methodIris: 'Plătește cu IRIS Pay',
    alertMessage: 'Aceasta este o demonstrație a IRIS Pay. Vă rugăm să selectați metoda de plată cu sigla IRIS Pay pentru a continua.',
    title: 'Țara contului bancar',
    chooseBank: 'Selectați banca',
    chooseBankSubtitle: 'Când alegeți banca dvs., veți fi redirecționat către aplicația acesteia.',
    selectedBank: 'Banca selectată:',
    selectOtherBank: 'Alegeți altă bancă',
    instructions: 'Vă rugăm să urmați instrucțiunile după ce sunteți redirecționat către sistemul {bank}. Făcând clic pe butonul "Continuați", veți iniția o plată de la furnizorul de servicii de plată selectat.',
    continue: 'Continuați',
    sessionExpires: 'Sesiunea expiră în:',
    successTitle: 'Plată reușită!',
    successDesc: 'Tranzacția dvs. a fost inițiată și confirmată cu succes prin contul dvs. bancar.',
    receiptMerchant: 'Comerciant:',
    receiptBank: 'Bancă:',
    receiptDate: 'Data:',
    receiptRef: 'Nr. referință:',
    receiptAmount: 'Sumă:',
    backHome: 'Plată nouă',
    bankPortalTitle: 'Confirmare plată',
    bankPortalDesc: 'Vă rugăm să confirmați tranzacția către {merchant}.',
    bankPortalConfirm: 'Confirmă plata',
    bankPortalCancel: 'Anulează plata',
    merchantLabel: 'Comerciant:',
    amountLabel: 'Sumă:',
    description: 'Descriere:',
    date: 'Data:',
    storeHeader: 'Magazin Demo',
    productTitle: 'Premium Navy Hoodie',
    productSize: 'Mărime: L',
    productQty: 'Cantitate: 1',
    subtotalLabel: 'Subtotal',
    shippingLabel: 'Livrare',
    shippingVal: 'Gratuită',
    totalLabel: 'Total'
  },
  hr: {
    heroSubtitle: 'IRIS Pay čini prihvaćanje plaćanja brzim, sigurnim i do 60% jeftinijim. Stvaramo budućnost digitalnih plaćanja.',
    startNow: 'Započni sada',
    checkoutTitle: 'Odaberite način plaćanja',
    checkoutSubtitle: 'Molimo odaberite željeni način plaćanja za vašu narudžbu.',
    methodCard: 'Plaćanje karticom',
    methodTransfer: 'Bankovni prijenos',
    methodCod: 'Plaćanje pouzećem',
    methodIris: 'Plati putem IRIS Pay',
    alertMessage: 'Ovo je demonstracija IRIS Pay-a. Odaberite način plaćanja s logotipom IRIS Pay za nastavak.',
    title: 'Država bankovnog računa',
    chooseBank: 'Odaberite svoju banku',
    chooseBankSubtitle: 'Kada odaberete svoju banku, bit ćete preusmjereni na njezinu aplikaciju.',
    selectedBank: 'Odabrana banka:',
    selectOtherBank: 'Odaberite drugu banku',
    instructions: 'Molimo slijedite upute nakon što budete preusmjereni na sustav {bank}. Klikom na gumb "Nastavi" pokrenut ćete plaćanje od odabranog pružatelja usluga.',
    continue: 'Nastavi',
    sessionExpires: 'Sesija istječe za:',
    successTitle: 'Plaćanje uspješno!',
    successDesc: 'Vaša transakcija je uspješno pokrenuta i potvrđena putem vašeg bankovnog računa.',
    receiptMerchant: 'Trgovac:',
    receiptBank: 'Banka:',
    receiptDate: 'Datum:',
    receiptRef: 'Referentni br:',
    receiptAmount: 'Iznos:',
    backHome: 'Novo plaćanje',
    bankPortalTitle: 'Potvrda plaćanja',
    bankPortalDesc: 'Molimo potvrdite transakciju prema {merchant}.',
    bankPortalConfirm: 'Potvrdi plaćanje',
    bankPortalCancel: 'Otkaži plaćanje',
    merchantLabel: 'Trgovac:',
    amountLabel: 'Iznos:',
    description: 'Opis:',
    date: 'Datum:',
    storeHeader: 'Demo Trgovina',
    productTitle: 'Premium Navy Hoodie',
    productSize: 'Veličina: L',
    productQty: 'Količina: 1',
    subtotalLabel: 'Međuzbroj',
    shippingLabel: 'Dostava',
    shippingVal: 'Besplatna',
    totalLabel: 'Ukupno'
  },
  gr: {
    heroSubtitle: 'Το IRIS Pay κάνει την αποδοχή πληρωμών γρήγορη, ασφαλή και έως 60% φθηνότερη. Δημιουργούμε το μέλλον των ψηφιακών πληρωμών.',
    startNow: 'Ξεκινήστε τώρα',
    checkoutTitle: 'Επιλέξτε μέθοδο πληρωμής',
    checkoutSubtitle: 'Παρακαλώ επιλέξτε την προτιμώμενη μέθοδο πληρωμής για την παραγγελία σας.',
    methodCard: 'Πληρωμή με κάρτα',
    methodTransfer: 'Τραπεζική μεταφορά',
    methodCod: 'Αντικαταβολή',
    methodIris: 'Πληρωμή με IRIS Pay',
    alertMessage: 'Αυτή είναι μια επίδειξη του IRIS Pay. Επιλέξτε τη μέθοδο πληρωμής με το λογότυπο IRIS Pay για να συνεχίσετε.',
    title: 'Χώρα τραπεζικού λογαριασμού',
    chooseBank: 'Επιλέξτε την τράπεζά σας',
    chooseBankSubtitle: 'Όταν επιλέξετε την τράπεζά σας, θα ανακατευθυνθείτε στην εφαρμογή της.',
    selectedBank: 'Επιλεγμένη τράπεζα:',
    selectOtherBank: 'Επιλέξτε άλλη τράπεζα',
    instructions: 'Παρακαλώ ακολουθήστε τις οδηγίες αφού ανακατευθυνθείτε στο σύστημα της {bank}. Πατώντας το κουμπί "Συνέχεια", θα ξεκινήσετε μια πληρωμή.',
    continue: 'Συνέχεια',
    sessionExpires: 'Η συνεδρία λήγει σε:',
    successTitle: 'Η πληρωμή ολοκληρώθηκε!',
    successDesc: 'Η συναλλαγή σας ξεκίνησε και επιβεβαιώθηκε με επιτυχία μέσω του τραπεζικού σας λογαριασμού.',
    receiptMerchant: 'Έμπορος:',
    receiptBank: 'Τράπεζα:',
    receiptDate: 'Ημερομηνία:',
    receiptRef: 'Αριθμός αναφοράς:',
    receiptAmount: 'Ποσό:',
    backHome: 'Νέα πληρωμή',
    bankPortalTitle: 'Επιβεβαίωση πληρωμής',
    bankPortalDesc: 'Παρακαλώ επιβεβαιώστε τη συναλλαγή προς {merchant}.',
    bankPortalConfirm: 'Επιβεβαίωση πληρωμής',
    bankPortalCancel: 'Ακύρωση πληρωμής',
    merchantLabel: 'Έμπορος:',
    amountLabel: 'Ποσό:',
    description: 'Περιγραφή:',
    date: 'Ημερομηνία:',
    storeHeader: 'Demo Κατάστημα',
    productTitle: 'Premium Navy Hoodie',
    productSize: 'Μέγεθος: L',
    productQty: 'Ποσότητα: 1',
    subtotalLabel: 'Μερικό σύνολο',
    shippingLabel: 'Αποστολή',
    shippingVal: 'Δωρεάν',
    totalLabel: 'Σύνολο'
  },
  it: {
    heroSubtitle: 'IRIS Pay rende l\'accettazione dei pagamenti veloce, sicura e fino al 60% più economica. Creiamo il futuro dei pagamenti digitali.',
    startNow: 'Inizia ora',
    checkoutTitle: 'Scegli il metodo di pagamento',
    checkoutSubtitle: 'Seleziona il metodo di pagamento preferito per completare l\'ordine.',
    methodCard: 'Pagamento con carta',
    methodTransfer: 'Bonifico bancario',
    methodCod: 'Contrassegno',
    methodIris: 'Paga con IRIS Pay',
    alertMessage: 'Questa è una demo di IRIS Pay. Seleziona il metodo di pagamento con il logo IRIS Pay per continuare.',
    title: 'Paese del conto bancario',
    chooseBank: 'Seleziona la tua banca',
    chooseBankSubtitle: 'Quando scegli la tua banca, verrai reindirizzato alla sua applicazione.',
    selectedBank: 'Banca selezionata:',
    selectOtherBank: 'Seleziona un\'altra banca',
    instructions: 'Segui le istruzioni dopo essere stato reindirizzato al sistema di {bank}. Cliccando sul pulsante "Continua", avvierai un pagamento.',
    continue: 'Continua',
    sessionExpires: 'La sessione scade in:',
    successTitle: 'Pagamento riuscito!',
    successDesc: 'La tua transazione è stata avviata e confermata con successo tramite il tuo conto bancario.',
    receiptMerchant: 'Esercente:',
    receiptBank: 'Banca:',
    receiptDate: 'Data:',
    receiptRef: 'N. di riferimento:',
    receiptAmount: 'Importo:',
    backHome: 'Nuovo pagamento',
    bankPortalTitle: 'Conferma del pagamento',
    bankPortalDesc: 'Conferma la transazione a {merchant}.',
    bankPortalConfirm: 'Conferma pagamento',
    bankPortalCancel: 'Annulla pagamento',
    merchantLabel: 'Esercente:',
    amountLabel: 'Importo:',
    description: 'Descrizione:',
    date: 'Data:',
    storeHeader: 'Negozio Demo',
    productTitle: 'Premium Navy Hoodie',
    productSize: 'Taglia: L',
    productQty: 'Quantità: 1',
    subtotalLabel: 'Subtotale',
    shippingLabel: 'Spedizione',
    shippingVal: 'Gratuita',
    totalLabel: 'Totale'
  }
};

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
  // Update Live Date
  updateLiveDate();

  // Language Dropdown Setup
  initLanguageSelector();

  // Load flags
  renderFlags();

  // Load Bank grid
  renderBankGrid();

  // Set up mock checkout step action listeners
  initCheckoutSelector();

  // Back button event listener
  const backBtn = document.getElementById('back-to-list');
  if (backBtn) {
    backBtn.addEventListener('click', (e) => {
      e.preventDefault();
      switchToStep('bank-list');
    });
  }

  // Continue button event listeners inside Selected Bank view
  const btnContinueWidget = document.getElementById('btn-continue-widget');
  const btnContinueCircleWidget = document.getElementById('btn-continue-circle-widget');

  if (btnContinueWidget) {
    btnContinueWidget.addEventListener('click', showBankPortalInline);
  }
  if (btnContinueCircleWidget) {
    btnContinueCircleWidget.addEventListener('click', showBankPortalInline);
  }
});

function updateLiveDate() {
  const now = new Date();
  const formatDigit = (num) => num.toString().padStart(2, '0');
  state.paymentDate = `${now.getFullYear()}-${formatDigit(now.getMonth() + 1)}-${formatDigit(now.getDate())} ${formatDigit(now.getHours())}:${formatDigit(now.getMinutes())}:${formatDigit(now.getSeconds())}`;
}

// Initial Mock Checkout logic
function initCheckoutSelector() {
  const methodCards = document.querySelectorAll('.method-card');
  const btnNext = document.getElementById('btn-checkout-next');
  const alertBox = document.getElementById('checkout-alert');

  methodCards.forEach(card => {
    card.addEventListener('click', () => {
      // Clear selections
      methodCards.forEach(el => el.classList.remove('method-card--selected'));
      const radios = document.querySelectorAll('.method-card__radio');
      radios.forEach(r => r.checked = false);

      // Select clicked
      card.classList.add('method-card--selected');
      const radio = card.querySelector('.method-card__radio');
      if (radio) radio.checked = true;

      state.selectedMethod = card.dataset.method;
      
      // Hide alert when choice changes
      if (alertBox) alertBox.style.display = 'none';
    });
  });

  if (btnNext) {
    btnNext.addEventListener('click', () => {
      if (state.selectedMethod !== 'iris') {
        // Show guidance alert
        if (alertBox) {
          alertBox.textContent = translations[state.lang].alertMessage;
          alertBox.style.display = 'block';
        }
      } else {
        // Transition to Iris Pay bank selector
        switchToStep('bank-list');
        // Start countdown timer when entering Iris Pay payment gateway
        startTimer();
      }
    });
  }
}

// Render Country flags filter
function renderFlags() {
  const container = document.getElementById('flags-container');
  if (!container) return;

  container.innerHTML = '';
  
  Object.keys(flags).forEach(countryCode => {
    const flagEl = document.createElement('div');
    flagEl.className = `country-flag ${state.selectedCountry === countryCode ? 'country-flag--active' : ''}`;
    flagEl.dataset.country = countryCode;
    flagEl.innerHTML = flags[countryCode];
    
    flagEl.addEventListener('click', () => {
      document.querySelectorAll('.country-flag').forEach(el => el.classList.remove('country-flag--active'));
      flagEl.classList.add('country-flag--active');
      state.selectedCountry = countryCode;
      renderBankGrid();
    });
    
    container.appendChild(flagEl);
  });
}

// Render Bank Grid items
function renderBankGrid() {
  const grid = document.getElementById('bank-grid');
  if (!grid) return;

  grid.innerHTML = '';
  
  const filteredBanks = banks.filter(bank => bank.countries.includes(state.selectedCountry));

  filteredBanks.forEach(bank => {
    const bankEl = document.createElement('div');
    bankEl.className = 'bank-item';
    bankEl.dataset.id = bank.id;
    
    const logoContainer = document.createElement('div');
    logoContainer.className = 'bank-logo';
    logoContainer.innerHTML = bank.logo;
    
    bankEl.appendChild(logoContainer);
    
    bankEl.addEventListener('click', () => {
      state.selectedBank = bank;
      switchToStep('bank-confirm');
    });
    
    grid.appendChild(bankEl);
  });
}

// Switch between widget step views
function switchToStep(step) {
  state.step = step;
  
  const viewCheckout = document.getElementById('view-checkout-select');
  const viewList = document.getElementById('view-bank-list');
  const viewConfirm = document.getElementById('view-bank-confirm');
  const viewPortal = document.getElementById('view-bank-portal');
  const timerHeader = document.getElementById('widget-timer-header');
  const widgetMainPanel = document.querySelector('.widget-main');
  
  // Normal state: remove dark theme background
  if (widgetMainPanel) {
    widgetMainPanel.classList.remove('widget-main--dark');
  }

  if (step === 'checkout-select') {
    if (viewCheckout) viewCheckout.style.display = 'block';
    if (viewList) viewList.style.display = 'none';
    if (viewConfirm) viewConfirm.style.display = 'none';
    if (viewPortal) viewPortal.style.display = 'none';
    if (timerHeader) timerHeader.style.display = 'none';
    state.selectedBank = null;
    stopTimer();
  } else if (step === 'bank-list') {
    if (viewCheckout) viewCheckout.style.display = 'none';
    if (viewList) viewList.style.display = 'block';
    if (viewConfirm) viewConfirm.style.display = 'none';
    if (viewPortal) viewPortal.style.display = 'none';
    if (timerHeader) timerHeader.style.display = 'flex';
    state.selectedBank = null;
  } else if (step === 'bank-confirm') {
    if (viewCheckout) viewCheckout.style.display = 'none';
    if (viewList) viewList.style.display = 'none';
    if (viewConfirm) viewConfirm.style.display = 'block';
    if (viewPortal) viewPortal.style.display = 'none';
    if (timerHeader) timerHeader.style.display = 'flex';
    
    // Update labels in selected bank confirmation view
    const bankNameElements = document.querySelectorAll('.dynamic-bank-name');
    bankNameElements.forEach(el => el.textContent = state.selectedBank.name);
    
    const instrText = document.getElementById('instructions-text');
    if (instrText) {
      const htmlText = translations[state.lang].instructions.replace('{bank}', state.selectedBank.name);
      instrText.innerHTML = htmlText;
    }
  } else if (step === 'bank-portal') {
    if (viewCheckout) viewCheckout.style.display = 'none';
    if (viewList) viewList.style.display = 'none';
    if (viewConfirm) viewConfirm.style.display = 'none';
    if (viewPortal) viewPortal.style.display = 'block';
    if (timerHeader) timerHeader.style.display = 'flex';
    
    // Apply dark theme class to right panel
    if (widgetMainPanel) {
      widgetMainPanel.classList.add('widget-main--dark');
    }
  }
}

// Show Inline Bank Portal (replaces overlay portal)
function showBankPortalInline() {
  updateLiveDate();
  switchToStep('bank-portal');

  const portalLogoContainer = document.getElementById('portal-bank-logo-container');
  const portalMerchant = document.getElementById('portal-merchant-val');
  const portalDesc = document.getElementById('portal-desc-val');
  const portalDate = document.getElementById('portal-date-val');
  const portalAmount = document.getElementById('portal-amount-val');

  if (portalLogoContainer) portalLogoContainer.innerHTML = state.selectedBank.logo;
  if (portalMerchant) portalMerchant.textContent = state.merchantName;
  if (portalDesc) portalDesc.textContent = state.paymentDescription;
  if (portalDate) portalDate.textContent = state.paymentDate;
  if (portalAmount) portalAmount.textContent = `${state.amount.toFixed(2)} ${state.currency}`;

  // Bind inline confirm and cancel buttons
  const confirmBtn = document.getElementById('portal-btn-confirm');
  const cancelBtn = document.getElementById('portal-btn-cancel');

  if (confirmBtn) {
    confirmBtn.replaceWith(confirmBtn.cloneNode(true)); // Clear previous listeners
    document.getElementById('portal-btn-confirm').addEventListener('click', showSuccessPage);
  }
  if (cancelBtn) {
    cancelBtn.replaceWith(cancelBtn.cloneNode(true));
    document.getElementById('portal-btn-cancel').addEventListener('click', () => {
      switchToStep('bank-confirm');
    });
  }
}

// Show Success Receipt Page inside Widget
function showSuccessPage() {
  stopTimer();

  const widgetContent = document.getElementById('widget-content-body');
  const timerHeader = document.getElementById('widget-timer-header');
  const widgetMainPanel = document.querySelector('.widget-main');
  
  if (widgetMainPanel) {
    widgetMainPanel.classList.remove('widget-main--dark');
  }

  if (timerHeader) {
    timerHeader.style.display = 'none';
  }

  if (widgetContent) {
    // Generate reference number
    const refNum = 'IRP-' + Math.floor(10000000 + Math.random() * 90000000);
    
    widgetContent.innerHTML = `
      <div class="success-card">
        <div class="success-icon-box">
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </div>
        <h2 class="success-title">${translations[state.lang].successTitle}</h2>
        <p class="success-desc">${translations[state.lang].successDesc}</p>
        
        <div class="receipt-box">
          <div class="receipt-row">
            <span class="receipt-label">${translations[state.lang].receiptMerchant}</span>
            <span class="receipt-value">${state.merchantName}</span>
          </div>
          <div class="receipt-row">
            <span class="receipt-label">${translations[state.lang].receiptBank}</span>
            <span class="receipt-value">${state.selectedBank.name}</span>
          </div>
          <div class="receipt-row">
            <span class="receipt-label">${translations[state.lang].receiptDate}</span>
            <span class="receipt-value">${state.paymentDate}</span>
          </div>
          <div class="receipt-row">
            <span class="receipt-label">${translations[state.lang].receiptRef}</span>
            <span class="receipt-value">${refNum}</span>
          </div>
          <div class="receipt-row">
            <span class="receipt-label">${translations[state.lang].receiptAmount}</span>
            <span class="receipt-value">${state.amount.toFixed(2)} ${state.currency}</span>
          </div>
        </div>
        
        <button id="btn-success-reset" class="btn btn--cyan" style="border-radius: 2rem; padding: 0.65rem 2.2rem; font-size: 0.9rem;">
          ${translations[state.lang].backHome}
        </button>
      </div>
    `;
    
    document.getElementById('btn-success-reset').addEventListener('click', resetWidgetFlow);
  }
}

// Reset entire flow back to checkout selection
function resetWidgetFlow() {
  const widgetContent = document.getElementById('widget-content-body');
  if (widgetContent) {
    widgetContent.innerHTML = `
      <!-- Step 1: Mock Merchant Checkout -->
      <div id="view-checkout-select">
        <h3 class="widget-title" data-t="checkoutTitle">${translations[state.lang].checkoutTitle}</h3>
        <p class="widget-subtitle" data-t="checkoutSubtitle">${translations[state.lang].checkoutSubtitle}</p>
        
        <div class="checkout-methods">
          <div class="method-card" data-method="card">
            <input type="radio" name="payment-method" class="method-card__radio">
            <div class="method-card__details">
              <span class="method-card__name" data-t="methodCard">${translations[state.lang].methodCard}</span>
              <div class="method-card__icons">
                <svg class="method-card__icon" viewBox="0 0 36 24" width="36" height="24"><rect width="36" height="24" rx="3" fill="#0f1c3f"/><text x="4" y="16" fill="#fff" font-size="9" font-family="sans-serif" font-weight="bold">CARD</text></svg>
              </div>
            </div>
          </div>
          
          <div class="method-card" data-method="transfer">
            <input type="radio" name="payment-method" class="method-card__radio">
            <div class="method-card__details">
              <span class="method-card__name" data-t="methodTransfer">${translations[state.lang].methodTransfer}</span>
              <div class="method-card__icons">
                <svg class="method-card__icon" viewBox="0 0 36 24" width="36" height="24"><rect width="36" height="24" rx="3" fill="#eceff1"/><path d="M18 6 L8 12 L28 12 Z M10 12 L10 18 M14 12 L14 18 M18 12 L18 18 M22 12 L22 18 M26 12 L26 18 M6 18 L30 18 L30 20 L6 20 Z" fill="#546e7a"/></svg>
              </div>
            </div>
          </div>
          
          <div class="method-card" data-method="cod">
            <input type="radio" name="payment-method" class="method-card__radio">
            <div class="method-card__details">
              <span class="method-card__name" data-t="methodCod">${translations[state.lang].methodCod}</span>
              <div class="method-card__icons">
                <svg class="method-card__icon" viewBox="0 0 36 24" width="36" height="24"><rect width="36" height="24" rx="3" fill="#eceff1"/><path d="M8 8 L28 8 L28 18 L8 18 Z M18 6 L12 8 M18 6 L24 8 M18 8 L18 18" stroke="#546e7a" stroke-width="1.5" fill="none"/></svg>
              </div>
            </div>
          </div>
          
          <div class="method-card method-card--iris method-card--selected" data-method="iris">
            <input type="radio" name="payment-method" class="method-card__radio" checked>
            <div class="method-card__details">
              <span class="method-card__name" data-t="methodIris">${translations[state.lang].methodIris}</span>
              <img src="iris-logo.svg" alt="IRIS Pay Logo" class="method-card__logo">
            </div>
          </div>
        </div>
        
        <!-- Guidance Alert Box -->
        <div class="checkout-alert" id="checkout-alert"></div>
        
        <button class="btn btn--cyan" id="btn-checkout-next" style="margin-top: 1rem; border-radius: 2rem; width: 100%;">
          <span data-t="continue">${translations[state.lang].continue}</span>
        </button>
      </div>

      <!-- Step 2: Country & Bank Selection (Initially Hidden) -->
      <div id="view-bank-list" style="display: none;">
        <h3 class="widget-title" data-t="title">${translations[state.lang].title}</h3>
        <div class="country-selector" id="flags-container"></div>
        
        <h3 class="widget-title" data-t="chooseBank" style="margin-top: 1rem;">${translations[state.lang].chooseBank}</h3>
        <p class="widget-subtitle" data-t="chooseBankSubtitle">${translations[state.lang].chooseBankSubtitle}</p>
        <div class="bank-grid" id="bank-grid"></div>
      </div>

      <!-- Step 3: Selected Bank Confirmation (Initially Hidden) -->
      <div id="view-bank-confirm" class="selected-bank-view" style="display: none;">
        <div class="selected-bank-header">
          <div class="selected-bank-title">
            <span data-t="selectedBank">${translations[state.lang].selectedBank}</span>
            <span class="selected-bank-name dynamic-bank-name">Revolut</span>
          </div>
          <a href="#" class="back-link" id="back-to-list">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="transform: rotate(180deg);">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
            <span data-t="selectOtherBank">${translations[state.lang].selectOtherBank}</span>
          </a>
        </div>
        
        <div class="selected-bank-instructions" id="instructions-text"></div>
        
        <div class="selected-bank-actions">
          <button class="btn btn--widget-continue" id="btn-continue-widget">
            <span data-t="continue">${translations[state.lang].continue}</span>
          </button>
          <button class="btn--circle-arrow-widget" id="btn-continue-circle-widget">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </button>
        </div>
      </div>

      <!-- Step 4: Inline Mock Bank Portal (Initially Hidden) -->
      <div id="view-bank-portal" class="bank-portal-inline" style="display: none;">
        <div class="bank-portal-inline__logo" id="portal-bank-logo-container"></div>
        <h2 class="bank-portal-inline__title" data-t="bankPortalTitle">${translations[state.lang].bankPortalTitle}</h2>
        <p class="bank-portal-inline__desc" id="portal-desc-text">
          Моля, потвърдете трансакцията към <span id="portal-desc-merchant">Iris Solutions</span>.
        </p>
        
        <div class="bank-portal-inline__info-box">
          <div class="bank-portal-inline__row">
            <span class="bank-portal-inline__label" data-t="merchantLabel">${translations[state.lang].merchantLabel}</span>
            <span class="bank-portal-inline__val" id="portal-merchant-val">Iris Solutions</span>
          </div>
          <div class="bank-portal-inline__row">
            <span class="bank-portal-inline__label" data-t="description">${translations[state.lang].description}</span>
            <span class="bank-portal-inline__val" id="portal-desc-val">IRIS-1042: Premium Navy Hoodie</span>
          </div>
          <div class="bank-portal-inline__row">
            <span class="bank-portal-inline__label" data-t="date">${translations[state.lang].date}</span>
            <span class="bank-portal-inline__val" id="portal-date-val">2026-07-08 14:53:24</span>
          </div>
          <div class="bank-portal-inline__row">
            <span class="bank-portal-inline__label" data-t="amountLabel">${translations[state.lang].amountLabel}</span>
            <span class="bank-portal-inline__val" id="portal-amount-val">30.00 EUR</span>
          </div>
        </div>
        
        <button id="portal-btn-confirm" class="btn btn--portal-confirm">${translations[state.lang].bankPortalConfirm}</button>
        <button id="portal-btn-cancel" class="btn btn--portal-cancel">${translations[state.lang].bankPortalCancel}</button>
      </div>
    `;

    // Re-bind all action listeners
    state.selectedCountry = 'bg';
    state.selectedBank = null;
    state.selectedMethod = 'iris';
    state.step = 'checkout-select';
    state.timerSeconds = 240;
    
    renderFlags();
    renderBankGrid();
    initCheckoutSelector();

    // Rebind back button
    document.getElementById('back-to-list').addEventListener('click', (e) => {
      e.preventDefault();
      switchToStep('bank-list');
    });

    // Rebind continue buttons to load the inline bank portal
    document.getElementById('btn-continue-widget').addEventListener('click', showBankPortalInline);
    document.getElementById('btn-continue-circle-widget').addEventListener('click', showBankPortalInline);
  }
}

// Timer Logic
function startTimer() {
  const timerMinEl = document.getElementById('timer-minutes');
  const timerSecEl = document.getElementById('timer-seconds');
  if (!timerMinEl || !timerSecEl) return;

  state.timerSeconds = 240;
  timerMinEl.textContent = '04';
  timerSecEl.textContent = '00';

  clearInterval(state.timerInterval);
  state.timerInterval = setInterval(() => {
    state.timerSeconds--;
    
    const minutes = Math.floor(state.timerSeconds / 60);
    const seconds = state.timerSeconds % 60;
    
    timerMinEl.textContent = minutes.toString().padStart(2, '0');
    timerSecEl.textContent = seconds.toString().padStart(2, '0');
    
    if (state.timerSeconds <= 0) {
      clearInterval(state.timerInterval);
      alert("Сесията изтече!");
      resetWidgetFlow();
    }
  }, 1000);
}

function stopTimer() {
  clearInterval(state.timerInterval);
}

// Language Selector dropdown supporting 6 languages (BG, EN, RO, HR, GR, IT)
function initLanguageSelector() {
  const btn = document.getElementById('language-toggle');
  const dropdown = document.getElementById('language-dropdown');
  const currentLangText = document.getElementById('current-lang-text');
  
  if (!btn || !dropdown) return;
  
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    btn.classList.toggle('language-btn--open');
    dropdown.classList.toggle('language-dropdown--open');
  });

  document.addEventListener('click', () => {
    btn.classList.remove('language-btn--open');
    dropdown.classList.remove('language-dropdown--open');
  });

  // Language items click handler
  document.querySelectorAll('.language-item').forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const newLang = item.dataset.lang;
      state.lang = newLang;
      if (currentLangText) {
        currentLangText.textContent = newLang.toUpperCase();
      }
      translatePage();
    });
  });
}

// Page translation handler
function translatePage() {
  const t = translations[state.lang];
  
  // Header menu or page elements
  document.querySelectorAll('[data-t]').forEach(el => {
    const key = el.dataset.t;
    if (t[key]) {
      el.innerHTML = t[key];
    }
  });

  // Re-run instructions update if in bank-confirm step
  if (state.step === 'bank-confirm' && state.selectedBank) {
    const instrText = document.getElementById('instructions-text');
    if (instrText) {
      const htmlText = t.instructions.replace('{bank}', state.selectedBank.name);
      instrText.innerHTML = htmlText;
    }
    
    const bankNameElements = document.querySelectorAll('.dynamic-bank-name');
    bankNameElements.forEach(el => el.textContent = state.selectedBank.name);
  }
}
