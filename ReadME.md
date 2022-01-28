# CRUD İşlemleri ve NoSQL vs SQL Arasındaki Farklar
Bu repo, A101 ve Patika işbirliğinde gerçekleşen Amazon Lambda & DynamoDB Bootcamp Node.js ve TypeScript Programı 3.hafta ödev içeriğini kapsar.  
</br>  

# Ödev İsterleri
> 1  
- Product tablosuna ürün ekleyen **POST** endpointi  
    + Product tablosunda yer alması gereken özellikler:  
    ```
    {
        productId: string,
        stock: number,
        productName: string,
        isDiscount: boolean,
        category: {
            categoryId: number,
            categoryName: string,
            }
    }

    ```  
- Eklenen tüm ürünleri çeken bir **GET** endpointi  
    + Tüm ürünler içerisinde *productID*'ye göre query params ile filtreleme yapılacak şekilde endpoint  
    + Tüm ürünlerin içerisinden üzerinde *discount* olan ürünlere göre filtreleme yapacak endpoint  
- *productID* ile herhangi bir product'ı silecek **DELETE** endpointi  
***NOT:*** Üzerinde *isDiscount* olan herhangi bir product silinmemeli, hata dönmeli.  
- Herhangi bir product'ın stoğunu değiştirecek **UPDATE** servisi yazınız.  

> 2   
- NoSQL ve SQL arasındaki farkları anlattığınız bir yazı yazınız.  

</br></br>  

# Node.js ve AWS DynamoDB ile CRUD İşlemleri
Aşağıda genel bilgiler ve ön hazırlık aşamaları verilmiştir. Ayrıntılı CRUD işlemlerine [link](https://github.com/A101-Node-js-TypeScript-Bootcamp/a101-bootcamp-odev3-berceou/blob/main/CRUD-Operations/CRUD-Operations.md) aracılığıyla ulaşabilirsiniz.  
</br>  

**Express**, Node.js üzerine web uygulamaları oluşturmaya yönelik bir frameworktür. Node.js'de zaten mevcut olan sunucu oluşturma sürecini basitleştirir.  
**DynamoDB** bir NoSQL veritabanıdır.  
**CRUD (Create Read Update Delete)** ise sunucuların yürütmesini sağladığımız bir dizi işlemdir.  

- Create (POST) - Veri oluştur  
- Read (GET) - Veri al  
- Update (PUT) - Veriyi değiştir/güncelle  
- Delete (DELETE) - Veriyi kaldır/sil  

Bu istekler, Rest API'leri oluşturmamıza olanak tanır.  
<p align=center><img width=400 src="CRUD-Operations\img\dynamodb-crud-nodejs.png"></p>

</br>  

## Ön Hazırlık

Başlamadan önce kullanılması gereken bazı paketlerin kurulumu gerekmektedir. **Node.js** üzerinde çalışacağımız için öncelikle node kurulu olması gerekir. Aşağıdaki komut ile terminalden node.js versiyonunu kontrol edilebilir.
```terminal
$ node -v
```  
Proje için bir klasör oluşturduktan sonra bir ```package.json``` dosyası oluşturulmalıdır. Burada default bilgileri kabul etmek için "-y" direktifi kullanılır.    
```
npm init -y
```  
Express'i kurmak için aşağıdaki komut kullanılmaktadır.
```
npm install express
```  
DynamoDB için kullanılacak olan AWS-SDK paket kurulumu ise aşağıdaki komut ile kurulmalıdır.  
```
npm install aws-sdk
```
Rastgele ID üretmek için uuid paketi kullanılmaktadır. Bu sayede üretilen ID her gönderi için bölüm anahtarı (partition key) olarak kullanılır.  
```
npm install uuid
```  
Environment variables dosya işlemleri için .env paket kurulumu kolaylık sağlamaktadır.  
```
npm install dotenv
```  

Kurulum işlemleri tamamlandıktan sonra ```package.json``` dosyasından ```"dependencies"``` başlığı altından kullanılan paketler görülmektedir.  

Paketlerden sonra AWS hesabı ile [IAM User](https://docs.aws.amazon.com/IAM/latest/UserGuide/introduction.html) oluşturulması gerekmektedir. IAM (Identity and Access Management), diğer AWS hizmetlerine erişimi ve kimlik doğrulamasını yönetmek için kullanılan bir AWS hizmetidir. DynamoDB'ye erişmek için IAM panosuna gidin ve yeni bir kullanıcı oluşturmak için "Users" ve ardından "Add User" adımları izlenmelidir. Sonrasında eklemek istediğiniz politikayı seçmenizi isteyen bir açılacaktır bu aşamada **AmazonDynamoDBFullAccess** seçilmelidir.


Ayrıca, [AWS CLI](https://docs.aws.amazon.com/comprehend/latest/dg/setup-awscli.html) ayarlanmalıdır. Alınan ```aws_access_key_id``` ve ```aws_secret_access_key``` bizim veritabanıyla bağlantımızı sağlayacak ve tüm işlemlerimiz gerçekleşecektir. Bu şifreleri bir ```.env``` dosyasında saklayarak ilerlemek tercih edilmiştir.  
Son olarak, tablo oluşturmak ve kullanmak için [AWS dökümantasyonu](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/getting-started-step-1.html) incelenebilir. Proje içerisinde kullanılacak olan **product** isimli ve *productID* içerikli bir partition key'e sahip olan bir tablo oluşturularak kodlama aşamasına geçiş yapılmıştır.  
</br>  

## Proje Yapısı Görüntüsü
</br>  

<img align="left" width=200 src="CRUD-Operations\img\folder-structure.png">  
</br></br></br></br></br>

***Config.JSON:*** Bu klasör, yapılandırmayla ilgili yani DynamoDB AWS SDK örneğini dışa aktaracak koda sahip olan dosyayı içerir. Bu sayede DynamoDB API'leri istenilen her yere DynamoDB örneğini yazmak yerine aktararak işlem yapılmaktadır.    
</br>  

***Controllers:*** Herhangi bir yardımcı/ortak program işleviyle ilgili tüm dosyaları tutmak içindir. Proje içeriği olarak ***product*** ile ilgili işlevleri içerir.  
</br>  

***Model:*** CRUD işlemleri için tüm fonksiyonlarını tutacak ana klasördür. Veritabanı işlemleri sağlanır.  
</br>  

***Routes:*** Projede birden çok kez kullanılacak olan işlevleri ve endpointleri tutan ve controller'a yönlendirmek için kullanılır. 

</br></br></br></br></br></br>  

# SQL ve NoSQL Farklılıkları
Aşağıda verilen tablo özet niteliğindedir. Detaylı içeriğe [link](https://github.com/A101-Node-js-TypeScript-Bootcamp/a101-bootcamp-odev3-berceou/tree/main/NoSQL-vs-SQL) aracılığıyla ulaşabilirsiniz.  

</br>  

|**SQL**| **NoSQL**|
|--------|----------|
|İlişkiseldir. | İlişkisel değildir.|
| Çok satırlı, karmaşık ve ilişkili işlemler için daha uygundur. | Belgeler veya JSON gibi yapılandırılmamış veriler için daha iyidir. |
| Tablo tabanlıdır. | Belge, anahtar/değer, grafik veya geniş sütun depolarıdır. |
| Esnek değildir. | Esneklik sağlar. |
| Standart ve yapılandırılmış sorgu dili kullanır. Önceden tanımlanmış bir şemaya sahiptir. | Ortak bir sözdizimi yoktur, unique yapıdadır. Yapılandırımamış veriler için dinamik şemalara sahiptir. |
| Dikey veri ölçeklenmesi | Yatay veri ölçeklenmesi | 
| Kullanım alanına göre daha maliyetli sayılabilir. | Hız ve yatay büyüme ile gereksiz ek maliyetten kurtulma söz konusudur. |
| Tutarlılık ve bütünlük çok önemlidir. | Bir biçime bağlı kalması gerekmez. |   


