# DevConnect - Geliştiriciler İçin Sosyal Ağ

**DevConnect**, geliştiricilerin projelerini, deneyimlerini ve yeteneklerini paylaşabileceği interaktif bir sosyal ağ uygulamasıdır. Bu proje, modern frontend teknolojileri ile geliştirildi ve Firebase üzerinden kullanıcı yönetimi sağlanmaktadır.

## Özellikler

- **Kullanıcı Doğrulama:**
  - E-posta & Şifre, Google ve GitHub ile giriş/kayıt
  - Firebase Authentication ile güvenli oturum yönetimi
- **Profil Sayfası:**
  - Kullanıcının profil bilgilerini (fotoğraf, isim, e-posta, telefon vb.) gösterir
  - Kullanıcıya özel profil sayfası (örn. `/profile/{uid}`)
  - Giriş yapmamış kullanıcılar için bilgilendirici fallback sayfası (örn. `/profile-info`)
- **Home Sayfası:**
  - Sol tarafta sidebar (Profil sayfasına gitme ve çıkış yapma butonları)
  - Sağ üstte kullanıcı bilgilerini gösteren kart
- **Global State Yönetimi:**
  - Redux Toolkit kullanılarak kullanıcı durumunun yönetilmesi
- **Routing:**
  - React Router ile özel (protected) rotalar (PrivateRoute)
- **UI/UX:**
  - Tailwind CSS ile modern ve responsive tasarım
  - Arka plan olarak dinamik (GIF) görsel kullanımı
- **Bildirimler:**
  - React Toastify ile hata ve bilgi bildirimleri

## Teknolojiler

- **React** (TypeScript & JavaScript)
- **Vite** – Hızlı geliştirme ve derleme
- **Tailwind CSS** – Modern UI tasarımı
- **Firebase** – Kimlik doğrulama ve veritabanı
- **Redux Toolkit** – Global state yönetimi
- **React Router** – Sayfa yönlendirme
- **React Toastify** – Bildirim sistemi

## Proje Yapısı

```plaintext
src/
├── app/
│   └── store.ts              # Redux store konfigürasyonu ve tipler
├── components/
│   ├── Header.tsx            # Uygulama başlığı
│   ├── PrivateRoute.tsx      # Korumalı rotalar için PrivateRoute bileşeni
│   ├── Sidebar.tsx           # Sol menü: Profil ve Logout butonları
│   └── UserCard.tsx          # Kullanıcı bilgilerini gösteren kart
├── features/
│   └── user/
│       └── userSlice.ts      # Kullanıcı durumunun yönetildiği Redux slice'ı
├── pages/
│   ├── Home.tsx              # Ana sayfa: Sidebar ve ana içerik
│   ├── Login.tsx             # Giriş sayfası
│   ├── SignUp.tsx            # Kayıt sayfası
│   ├── Profile.tsx           # Kullanıcıya özel profil sayfası
│   └── ProfileInfo.tsx       # Giriş yapmamış kullanıcılar için fallback sayfa
├── services/
│   ├── auth.ts               # Firebase auth işlemleri (giriş, kayıt, çıkış)
│   └── firebase.ts           # Firebase yapılandırması
├── types/
│   └── user.ts               # Global kullanıcı tipi (AppUser)
├── App.tsx                   # Uygulama rotaları
└── main.tsx                  # Uygulama giriş noktası



Kurulum
Gereksinimler
Node.js (>= 14.x)
npm veya yarn
Adım Adım Kurulum
Depoyu Klonlayın:

bash
Kopyala
git clone <repository-url>
cd <repository-directory>
Bağımlılıkları Yükleyin:

bash
Kopyala
npm install
veya yarn kullanıyorsanız:

bash
Kopyala
yarn install
Çevresel Değişkenleri Ayarlayın: Proje kök dizininde bir .env dosyası oluşturun ve Firebase yapılandırma bilgilerinizi ekleyin:

env
Kopyala
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
Geliştirme Sunucusunu Başlatın:

bash
Kopyala
npm run dev
veya yarn kullanıyorsanız:

bash
Kopyala
yarn dev
Tarayıcıda Açın: Geliştirme sunucusu çalıştıktan sonra, tarayıcınızda http://localhost:3000 (veya Vite'nin belirttiği port) adresine gidin.

Notlar
State Yönetimi ve Serileştirilebilirlik:
Redux store'da Firebase'den dönen karmaşık nesneler yerine, sadece gerekli alanları içeren sade bir AppUser nesnesi saklanmaktadır.

Gelecekteki Geliştirmeler:

Şifre sıfırlama işlemleri
Profil güncelleme ve ek sosyal özellikler
Post ve blog paylaşımı, takip sistemi, mesajlaşma gibi ek modüller
Dark Mode ve PWA desteği
Lisans
Bu proje MIT Lisansı kapsamında lisanslanmıştır.

Bu README, projenizin temel özelliklerini, kullanılan teknolojileri ve geliştirme sürecini özetlemektedir. Projenizi GitHub'a pushladıktan sonra, diğer geliştiriciler için de yol gösterici olacaktır. İyi çalışmalar!

yaml
Kopyala

---

```
# DevConnectSocial
