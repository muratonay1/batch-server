# Batch(Job) Server and My MicroService Architectural
# Writes the ExChange rates to the mongodb every day at 00:00
Database olarak mongo(local) kullanılmıştır.
Firestore modülü pocket-core içinde mevcuttur. Kendi serviceAccountKey json dosyasınızı proje içine kopyalayıp kendi firebase linkinizi verebilirsiniz.
Sql,Oracle connectionStringinizi koyup kendi metodlarınız ile batch çalıştırabilir, izleyebilirsiniz.
# Dilediğiniz gibi fork edip kullanabilir ve geliştirebilirseniz.
iletişim adresi: imuratony@gmail.com
![batch runing](https://user-images.githubusercontent.com/34923740/199949603-d854a2d0-4ac7-4277-80d0-c6694d61505c.PNG)
![db](https://user-images.githubusercontent.com/34923740/199949748-1319f69d-36b1-49aa-9f71-4bd68aae1e11.PNG)


# Micro servis mimarisine benzer bir yapı kurmaya çalıştığım yapıda oluşturulan .js sayfası bir servisi temsil etmektedir. Bu servis;
- Bir response dönebilir.
- İçerisinde başka bir servis responsunu alıp bu responsla işlem yapıp başka bir değer dönderebilir.
- Ya da tek seferlik tetiklenerek kendi içinde işlemini tamamlayıp çağrı sonlanabilir.
- Tasarlanan batchler içerisinde tetiklenerek, cron zamanı ayarlanan batch tetiklendiğinde batch içeisinde tetiklenip sonlanabilir.

- Kısaca micro servis mimarisine uydurulmaya çalışılmış bir yapıdır.

- GetMongoLogs servisi aldığı parametreye göre mongodb'den sorgulama yapar ve sonucu dönderir.
![GetMongoLogs](https://user-images.githubusercontent.com/34923740/208319099-7423a06e-91e7-4179-b672-6b13aed4cb00.PNG)

- Servis mongodb'den aldığı parametreye uygun arama yapar ve sonucu bir değişkene aktarır
![GetUserInfo](https://user-images.githubusercontent.com/34923740/208319081-e9a2eed6-f66d-47a8-b745-afb133afd44e.PNG)

