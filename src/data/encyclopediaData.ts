import localImages from '../assets/images';

export interface DiseaseEntry {
  id: string;
  name: string;
  latinName: string;
  crop: 'Padi' | 'Cabai' | 'Tomat' | 'Jagung' | 'Tanah' | 'Kentang' | 'Anggur' | 'Stroberi';
  category: 'Jamur / Fungi' | 'Bakteri' | 'Virus' | 'Hama Serangga' | 'Fisiologis / Nutrisi';
  severityDefault: 'Ringan' | 'Sedang' | 'Berat';
  imageUrl: string;
  symptoms: string[];
  triggerConditions: string;
  organicRemedy: string[];
  chemicalRemedy: string[];
  prevention: string[];
  dataSource?: string;
}

export const ENCYCLOPEDIA_DATA: DiseaseEntry[] = [
  // ===== CABAI =====
  {
    id: 'cabai-antraknosa',
    name: 'Antraknosa (Patek)',
    latinName: 'Colletotrichum capsici',
    crop: 'Cabai',
    category: 'Jamur / Fungi',
    severityDefault: 'Berat',
    imageUrl: localImages.sampleCabaiLeaf,
    symptoms: [
      'Bercak cekung melingkar berwarna cokelat kehitaman pada buah atau daun',
      'Massa spora berwarna jingga atau merah muda di tengah bercak saat lembap',
      'Buah menjadi keriput, membusuk, dan rontok sebelum matang'
    ],
    triggerConditions: 'Kelembapan tinggi (>85%) dan suhu hangat (25–30°C), sering muncul di musim hujan.',
    organicRemedy: [
      'Semprotkan ekstrak daun mimba atau rimpang lengkuas (konsentrasi 5%) tiap 4 hari',
      'Aplikasi agen hayati Trichoderma harzianum pada lubang tanam dan pangkal batang',
      'Petik dan musnahkan segera buah yang terserang, jangan dibiarkan membusuk di tanah'
    ],
    chemicalRemedy: [
      'Fungisida kontak berbahan aktif Mankozeb 80% atau Propineb 70%',
      'Fungisida sistemik berbahan aktif Azoksistrobin + Difenokonazol jika infeksi meluas'
    ],
    prevention: [
      'Gunakan mulsa plastik hitam perak untuk mengurangi percikan spora dari tanah',
      'Atur jarak tanam minimal 50 x 60 cm untuk sirkulasi udara optimal',
      'Hindari penggunaan pupuk Nitrogen (Urea) berlebihan saat pembungaan'
    ]
  },
  {
    id: 'cabai-embun-tepung',
    name: 'Embun Tepung (Powdery Mildew)',
    latinName: 'Leveillula taurica',
    crop: 'Cabai',
    category: 'Jamur / Fungi',
    severityDefault: 'Sedang',
    imageUrl: localImages.sampleCabaiLeaf,
    symptoms: [
      'Lapisan serbuk putih kelabu menyerupai tepung pada permukaan bawah daun',
      'Permukaan atas daun menunjukkan klorosis (bercak kuning tidak beraturan)',
      'Daun melengkung ke atas, mengering, lalu gugur sebelum waktunya'
    ],
    triggerConditions: 'Cuaca kering dengan kelembapan udara malam hari yang tinggi, sirkulasi udara buruk.',
    organicRemedy: [
      'Semprotan larutan baking soda (bikarbonat 5 gr/liter air) ditambah sedikit sabun kelapa',
      'Aplikasi jamur antagonis Ampelomyces quisqualis atau Trichoderma',
      'Pangkas cabang bawah tanaman (wiwil) untuk memperbaiki pencahayaan'
    ],
    chemicalRemedy: [
      'Fungisida sulfur (belerang larut) dosis 2–3 gr/liter',
      'Fungisida sistemik golongan Triazol seperti Triadimefon atau Heksakonazol'
    ],
    prevention: [
      'Jaga kebersihan lahan dari gulma inang',
      'Penyiraman di pagi hari pada area akar (bukan membasahi kanopi daun)',
      'Pemberian pupuk silika (Si) untuk memperkuat dinding sel kutikula daun'
    ]
  },

  // ===== PADI =====
  {
    id: 'padi-bercak-cokelat',
    name: 'Bercak Cokelat Padi (Brown Spot)',
    latinName: 'Bipolaris oryzae',
    crop: 'Padi',
    category: 'Jamur / Fungi',
    severityDefault: 'Sedang',
    imageUrl: localImages.samplePadiLeaf,
    symptoms: [
      'Bercak oval bundar berwarna cokelat tua dengan pusat berwarna abu-abu pada helai daun',
      'Bercak dikelilingi lingkaran halo berwarna kuning terang',
      'Pada gabah, terbentuk bercak hitam kelabu yang menurunkan mutu beras'
    ],
    triggerConditions: 'Tanah miskin hara (defisiensi Kalium, Silika, atau Seng), lahan stres kekeringan atau drainase buruk.',
    organicRemedy: [
      'Aplikasi pupuk kompos matang yang diperkaya Trichoderma saat olah tanah',
      'Perendaman benih (seed treatment) dengan larutan ekstrak kunyit atau air panas 52°C',
      'Pemberian abu sekam padi sebagai sumber silika organik alami'
    ],
    chemicalRemedy: [
      'Fungisida mankozeb, tebukonazol, atau difenokonazol saat anakan aktif',
      'Pupuk daun yang mengandung unsur mikro Zn (Zinc) dan KCL'
    ],
    prevention: [
      'Seimbangkan pemupukan N, P, dan K; jangan hanya menggunakan Urea',
      'Terapkan pengairan berselang (intermittent irrigation) untuk aerasi akar',
      'Gunakan benih bersertifikat bebas patogen'
    ]
  },
  {
    id: 'padi-hawar-daun',
    name: 'Hawar Daun Bakteri (Kresek)',
    latinName: 'Xanthomonas oryzae pv. oryzae',
    crop: 'Padi',
    category: 'Bakteri',
    severityDefault: 'Berat',
    imageUrl: localImages.cropPadiSawah,
    symptoms: [
      'Garis basah kehijauan di tepi daun yang meluas menjadi garis bergelombang abu-abu keputihan',
      'Daun mengering seperti terbakar terik matahari (kresek)',
      'Muncul cairan lendir bakteri (bacterial ooze) seperti titik embun kuning di pagi hari'
    ],
    triggerConditions: 'Angin kencang dan hujan lebat yang menimbulkan luka pada helai daun, pemupukan urea berlebih.',
    organicRemedy: [
      'Semprotan agens hayati bakteri Pseudomonas fluorescens atau Bacillus subtilis',
      'Hindari menyiram air sawah berlebihan saat fase tanaman luka',
      'Aplikasi asap cair kelapa (wood vinegar) konsentrasi 1:200'
    ],
    chemicalRemedy: [
      'Bakterisida tembaga hidroksida atau tembaga oksiklorida dosis 1.5 gr/L',
      'Bakterisida berbahan aktif kasugamisin atau oksitetrasiklin'
    ],
    prevention: [
      'Tanam varietas toleran hawar bakteri seperti Inpari 32 atau Ciherang',
      'Kurangi dosis urea pada musim penghujan',
      'Terapkan sistem tanam Jajar Legowo untuk sirkulasi udara sawah'
    ]
  },

  // ===== TOMAT =====
  {
    id: 'tomat-busuk-daun',
    name: 'Busuk Daun & Batang (Late Blight)',
    latinName: 'Phytophthora infestans',
    crop: 'Tomat',
    category: 'Jamur / Fungi',
    severityDefault: 'Berat',
    imageUrl: localImages.sampleTomatLeaf,
    symptoms: [
      'Bercak basah berwarna hijau gelap kehitaman tidak beraturan pada ujung daun',
      'Lapisan kapang halus keputihan di sisi bawah daun saat cuaca lembap basah',
      'Batang mengalami luka kecokelatan berair rapuh dan buah membusuk keras cokelat'
    ],
    triggerConditions: 'Suhu dingin sejuk (16–22°C) disertai kabut tebal, gerimis, atau kelembapan di atas 90%.',
    organicRemedy: [
      'Semprotkan ekstrak kulit bawang merah dan bawang putih sebagai antijamur',
      'Segera buang dan bakar daun atau ranting yang terinfeksi',
      'Gunakan atap paranet atau plastik UV pada bedengan di dataran tinggi'
    ],
    chemicalRemedy: [
      'Fungisida sistemik berbahan aktif Simoksanil + Mankozeb',
      'Fungisida kuratif Dimetomorf atau Mandipropamid'
    ],
    prevention: [
      'Lakukan penyiangan agar sirkulasi udara sekitar bedengan lancar',
      'Hindari menyiram tanaman dari bagian atas (gunakan irigasi tetes/kocor akar)',
      'Gunakan lanjaran/ajir tinggi agar daun tidak menyentuh tanah basah'
    ]
  },
  {
    id: 'tomat-kalsium-defisiensi',
    name: 'Busuk Pantat Buah (Blossom End Rot)',
    latinName: 'Physiological (Defisiensi Kalsium - Ca)',
    crop: 'Tomat',
    category: 'Fisiologis / Nutrisi',
    severityDefault: 'Sedang',
    imageUrl: localImages.sampleTomatLeaf,
    symptoms: [
      'Bagian ujung/pantat buah tomat tampak cekung basah lalu menghitam pipih',
      'Jaringan bagian bawah mengeras seperti kulit kering',
      'Bukan disebabkan oleh jamur atau serangga, melainkan translokasi kalsium terganggu'
    ],
    triggerConditions: 'Penyiraman yang tidak konsisten (tanah kering mendadak lalu banjir basah), pH tanah asam (< 5.5).',
    organicRemedy: [
      'Aplikasi pupuk kalsium organik dari cangkang telur halus yang dilarutkan asam cuka apel',
      'Mulsa jerami tebal di sekitar perakaran untuk menjaga kelembapan tanah konstan'
    ],
    chemicalRemedy: [
      'Semprot pupuk daun Kalsium Nitrat (Ca(NO3)2) konsentrasi 2–4 gr/liter ke buah muda',
      'Aplikasi dolomit/kapur pertanian 50–100 gr per lubang tanam'
    ],
    prevention: [
      'Jaga kelembapan tanah tetap stabil dengan penyiraman teratur tiap pagi',
      'Ukur dan naikkan pH tanah masam sebelum tanam',
      'Hindari pemupukan amonium/kalium dosis tinggi yang menghambat serapan kalsium'
    ]
  },
  {
    id: 'tomat-bercak-bakteri',
    name: 'Bercak Bakteri Tomat (Bacterial Spot)',
    latinName: 'Xanthomonas vesicatoria',
    crop: 'Tomat',
    category: 'Bakteri',
    severityDefault: 'Sedang',
    imageUrl: localImages.sampleTomatLeaf,
    dataSource: 'PlantVillage Dataset (Kaggle)',
    symptoms: [
      'Bercak kecil berair berwarna cokelat tua hingga hitam, dikelilingi halo kuning pada daun',
      'Lesi pada buah muda tampak cekung berwarna cokelat dengan tepi kasar berkerak',
      'Daun menguning dan rontok secara masif, menyebabkan defoliasi dini'
    ],
    triggerConditions: 'Suhu hangat (24–30°C) dengan kelembapan tinggi dan angin yang menyebarkan percikan air hujan.',
    organicRemedy: [
      'Semprotan larutan tembaga oktanoat organik dosis rendah secara preventif',
      'Aplikasi agens hayati Bacillus subtilis strain QST 713 tiap 5–7 hari',
      'Buang dan musnahkan bagian tanaman yang terinfeksi, hindari menyentuh daun basah'
    ],
    chemicalRemedy: [
      'Bakterisida berbahan aktif Tembaga Hidroksida atau Tembaga Oksiklorida 50%',
      'Kombinasi Mankozeb + Tembaga Sulfat untuk perlindungan ganda kontak-sistemik'
    ],
    prevention: [
      'Gunakan benih bersertifikat yang telah diberi perlakuan panas (hot water seed treatment 50°C)',
      'Hindari irigasi dari atas (overhead), gunakan irigasi tetes langsung ke akar',
      'Rotasi tanaman dengan non-solanaceae minimal 2 musim tanam'
    ]
  },
  {
    id: 'tomat-hawar-awal',
    name: 'Hawar Awal Tomat (Early Blight)',
    latinName: 'Alternaria solani',
    crop: 'Tomat',
    category: 'Jamur / Fungi',
    severityDefault: 'Sedang',
    imageUrl: localImages.sampleTomatLeaf,
    dataSource: 'PlantVillage Dataset (Kaggle)',
    symptoms: [
      'Bercak cokelat tua dengan pola cincin konsentris seperti "sasaran tembak" pada daun tua',
      'Daun menguning di sekitar bercak, dimulai dari daun bagian bawah menjalar ke atas',
      'Lesi pada batang membentuk kerak hitam memanjang pada pangkal dan persendian'
    ],
    triggerConditions: 'Suhu optimal 25–30°C dengan periode pembasahan daun yang panjang, tanaman stres nutrisi.',
    organicRemedy: [
      'Semprotan ekstrak bawang putih (3–5 siung + 1 liter air) tiap 3 hari',
      'Aplikasi fungisida biologi Trichoderma asperellum di zona perakaran',
      'Pemangkasan daun bawah yang terinfeksi untuk mencegah percikan spora ke atas'
    ],
    chemicalRemedy: [
      'Fungisida kontak Mankozeb 80% WP dosis 2 gr/liter secara preventif',
      'Fungisida sistemik Iprodion atau Chlorothalonil saat infeksi sudah meluas'
    ],
    prevention: [
      'Tanam pada bedengan yang ditinggikan dengan drainase baik untuk mengurangi kelembapan',
      'Pemberian pupuk Kalium yang cukup untuk memperkuat ketahanan jaringan daun',
      'Bersihkan sisa tanaman lama dari lahan sebelum musim tanam baru dimulai'
    ]
  },
  {
    id: 'tomat-kapang-daun',
    name: 'Kapang Daun Tomat (Leaf Mold)',
    latinName: 'Passalora fulva',
    crop: 'Tomat',
    category: 'Jamur / Fungi',
    severityDefault: 'Sedang',
    imageUrl: localImages.sampleTomatLeaf,
    dataSource: 'PlantVillage Dataset (Kaggle)',
    symptoms: [
      'Bercak kuning pucat tidak beraturan pada permukaan atas daun, awalnya seperti klorosis',
      'Lapisan beludru berwarna abu-abu kehijauan hingga ungu-cokelat di sisi bawah daun',
      'Daun mengering, menggulung, dan rontok; sangat merugikan pada tomat di greenhouse'
    ],
    triggerConditions: 'Kelembapan udara sangat tinggi (>85%) dan sirkulasi udara buruk, khas pada greenhouse atau musim hujan.',
    organicRemedy: [
      'Tingkatkan ventilasi dalam greenhouse atau buka naungan untuk mengurangi kelembapan',
      'Semprotan larutan susu skim 10% sebagai antijamur alami',
      'Aplikasi Bacillus amyloliquefaciens pada daun sebagai agen biokontrol'
    ],
    chemicalRemedy: [
      'Fungisida berbahan aktif Azoksistrobin, Difenokonazol, atau Klorotalonil',
      'Semprotan fungisida sistemik Mancozeb + Cymoxanil secara bergantian'
    ],
    prevention: [
      'Tanam varietas tomat tahan Cladosporium (umumnya ditandai gen Cf)',
      'Pastikan jarak tanam cukup lebar dan pangkas daun bawah secara berkala',
      'Kendalikan kelembapan relatif agar tetap di bawah 80% terutama pada malam hari'
    ]
  },
  {
    id: 'tomat-septoria',
    name: 'Bercak Daun Septoria',
    latinName: 'Septoria lycopersici',
    crop: 'Tomat',
    category: 'Jamur / Fungi',
    severityDefault: 'Sedang',
    imageUrl: localImages.sampleTomatLeaf,
    dataSource: 'PlantVillage Dataset (Kaggle)',
    symptoms: [
      'Bercak bulat kecil (2–4 mm) sangat banyak dengan pusat putih keabu-abuan dan tepi cokelat tua',
      'Titik hitam kecil (piknidia/kantong spora) terlihat di tengah bercak dengan kaca pembesar',
      'Infeksi dimulai dari daun bawah tua dan menjalar ke atas secara bertahap'
    ],
    triggerConditions: 'Cuaca basah dengan suhu 20–25°C, kelembapan tinggi, dan air hujan/irigasi yang memercik ke daun.',
    organicRemedy: [
      'Pangkas dan buang daun yang terinfeksi ke dalam kantong tertutup, jangan dikompos',
      'Semprotan campuran minyak neem (mimba) 2% + sabun insektisida 0.5% tiap 7 hari',
      'Mulsa jerami di bawah tanaman untuk mencegah percikan spora dari tanah'
    ],
    chemicalRemedy: [
      'Fungisida kontak Klorotalonil 75% WP atau Mankozeb secara bergantian',
      'Fungisida sistemik Tebukonazol atau Propikonazol jika infeksi parah'
    ],
    prevention: [
      'Rotasi tanaman dengan tanaman bukan famili Solanaceae selama minimal 2 tahun',
      'Gunakan mulsa plastik untuk mencegah spora tanah terpercik ke daun bawah',
      'Pilih lokasi tanam dengan cahaya matahari penuh untuk mempercepat pengeringan daun'
    ]
  },
  {
    id: 'tomat-tungau-merah',
    name: 'Tungau Merah (Spider Mites)',
    latinName: 'Tetranychus urticae',
    crop: 'Tomat',
    category: 'Hama Serangga',
    severityDefault: 'Sedang',
    imageUrl: localImages.featureHamaDaun,
    dataSource: 'PlantVillage Dataset (Kaggle)',
    symptoms: [
      'Bercak kekuningan stippling halus pada permukaan atas daun akibat pengisapan sel',
      'Jaring laba-laba halus tampak pada bagian bawah daun dan pucuk tanaman yang terserang parah',
      'Daun mengering berwarna perunggu kecokelatan lalu rontok; populasi meledak di musim kemarau'
    ],
    triggerConditions: 'Cuaca panas dan kering (>30°C, kelembapan <60%), penggunaan insektisida kimia yang membunuh predator alami.',
    organicRemedy: [
      'Semprotan air bertekanan tinggi pada bagian bawah daun untuk menghanyutkan koloni',
      'Aplikasi minyak neem (azadirachtin) 2% atau sabun insektisida berbasis kalium',
      'Introduksi predator alami Phytoseiulus persimilis atau Neoseiulus californicus'
    ],
    chemicalRemedy: [
      'Akarisida berbahan aktif Abamektin, Bifenazat, atau Spiromesifen',
      'Hindari insektisida piretroid yang justru memacu ledakan populasi tungau'
    ],
    prevention: [
      'Jaga kelembapan tanaman dengan irigasi teratur dan mulsa untuk mengurangi cekaman kering',
      'Monitor tanaman secara rutin dengan kaca pembesar pada daun bagian bawah',
      'Tanam tanaman refugia (bunga kuning/putih) di pinggir lahan untuk mengundang musuh alami'
    ]
  },
  {
    id: 'tomat-virus-kuning-keriting',
    name: 'Virus Kuning Keriting (Yellow Leaf Curl)',
    latinName: 'Tomato Yellow Leaf Curl Virus (TYLCV)',
    crop: 'Tomat',
    category: 'Virus',
    severityDefault: 'Berat',
    imageUrl: localImages.sampleTomatLeaf,
    dataSource: 'PlantVillage Dataset (Kaggle)',
    symptoms: [
      'Daun muda menggulung ke atas, mengecil, menebal, dan berwarna kuning pucat',
      'Tanaman kerdil dengan ruas batang yang memendek (roset)',
      'Bunga rontok sebelum menjadi buah; hasil panen turun hingga 100% jika terinfeksi dini'
    ],
    triggerConditions: 'Ditularkan secara persisten oleh kutu kebul (Bemisia tabaci) sebagai vektor utama; epidemi pada musim kemarau.',
    organicRemedy: [
      'Pasang perangkap kuning lengket (yellow sticky trap) untuk monitoring dan pengendalian kutu kebul',
      'Semprotkan minyak neem atau sabun insektisida untuk menekan populasi vektor',
      'Tanam tanaman pinggiran (barrier crops) seperti jagung untuk memblokir migrasi kutu kebul'
    ],
    chemicalRemedy: [
      'Insektisida sistemik Imidakloprid atau Asetamiprid untuk mengendalikan kutu kebul vektor',
      'Lakukan seed treatment dengan insektisida untuk perlindungan awal bibit di persemaian'
    ],
    prevention: [
      'Gunakan varietas tomat tahan TYLCV (umumnya diberi label kode Ty)',
      'Tutup persemaian dengan kasa anti-serangga (insect net 40 mesh) hingga bibit siap pindah tanam',
      'Eradikasi gulma inang kutu kebul di sekitar lahan secara menyeluruh'
    ]
  },
  {
    id: 'tomat-virus-mosaik',
    name: 'Virus Mosaik Tomat (Mosaic Virus)',
    latinName: 'Tomato Mosaic Virus (ToMV)',
    crop: 'Tomat',
    category: 'Virus',
    severityDefault: 'Berat',
    imageUrl: localImages.sampleTomatLeaf,
    dataSource: 'PlantVillage Dataset (Kaggle)',
    symptoms: [
      'Pola mosaik kuning-hijau tidak beraturan pada permukaan daun muda',
      'Daun muda mengeras, menggulung, dan berkerut seperti kertas kusut',
      'Buah menunjukkan warna tidak merata, permukaan berbintik-bintik cokelat kekuningan'
    ],
    triggerConditions: 'Ditularkan secara mekanis melalui alat pertanian, tangan manusia, dan benih yang terinfeksi.',
    organicRemedy: [
      'Celupkan alat pertanian dalam larutan susu skim 10% sebelum digunakan',
      'Cuci tangan dengan sabun setelah memegang tanaman sakit',
      'Segera cabut dan musnahkan tanaman yang terinfeksi sebelum virus menyebar lebih luas'
    ],
    chemicalRemedy: [
      'Tidak ada fungisida yang efektif untuk virus; kendalikan vektor kutu daun (Myzus persicae)',
      'Aplikasi insektisida sistemik untuk mengendalikan vektor secara preventif'
    ],
    prevention: [
      'Gunakan benih bersertifikat bebas virus dari produsen terpercaya',
      'Desinfeksi seluruh peralatan berkala menggunakan larutan bleach 10%',
      'Hindari merokok di area pertanian karena tembakau adalah reservoir ToMV'
    ]
  },

  // ===== JAGUNG =====
  {
    id: 'jagung-bulai',
    name: 'Penyakit Bulai Jagung (Downy Mildew)',
    latinName: 'Peronosclerospora maydis',
    crop: 'Jagung',
    category: 'Jamur / Fungi',
    severityDefault: 'Berat',
    imageUrl: localImages.cropJagungFarm,
    symptoms: [
      'Garis-garis kuning keputihan memanjang sejajar tulang daun pada daun muda',
      'Permukaan bawah daun bergaris tampak dilapisi serbuk putih halus di pagi hari',
      'Tanaman kerdil, ruas batang memendek, dan tongkol tidak terbentuk sempurna (banci)'
    ],
    triggerConditions: 'Embun malam tebal dengan suhu 21–25°C pada fase bibit jagung (umur 1–3 minggu).',
    organicRemedy: [
      'Cabut dan musnahkan tanaman yang terinfeksi bulai (eradikasi total) agar tidak menular',
      'Semprotan bio-fungisida Bacillus amyloliquefaciens'
    ],
    chemicalRemedy: [
      'Perlakuan benih (seed dressing) fungisida berbahan aktif Metalaksil atau Dimetomorf',
      'Semprotan fungisida sistemik Metalaksil pada umur 7, 14, dan 21 HST'
    ],
    prevention: [
      'Gunakan varietas tahan bulai seperti Bisi 18, NK 212, atau Pioneer P35',
      'Tanam serentak dalam rentang waktu tidak lebih dari 10 hari dalam satu hamparan',
      'Hindari menanam jagung terus menerus tanpa rotasi tanaman kacang-kacangan'
    ]
  },
  {
    id: 'jagung-karat-daun',
    name: 'Karat Daun Jagung (Common Rust)',
    latinName: 'Puccinia sorghi',
    crop: 'Jagung',
    category: 'Jamur / Fungi',
    severityDefault: 'Sedang',
    imageUrl: localImages.cropJagungFarm,
    dataSource: 'PlantVillage Dataset (Kaggle)',
    symptoms: [
      'Pustul (tonjolan kecil) berwarna cokelat kemerahan tersebar di kedua sisi helai daun',
      'Saat pustul matang, tepung spora berwarna jingga-cokelat mudah terlepas jika disentuh',
      'Infeksi berat menyebabkan daun menguning, mengering, dan produktivitas tongkol turun signifikan'
    ],
    triggerConditions: 'Suhu sejuk (16–23°C) dengan kelembapan tinggi dan embun malam; epidemi di dataran menengah-tinggi.',
    organicRemedy: [
      'Semprotan larutan belerang (sulfur) organik 80% WG dosis 3 gr/liter secara preventif',
      'Aplikasi bio-fungisida Bacillus subtilis atau Trichoderma harzianum pada daun',
      'Buang daun bawah yang terinfeksi parah untuk mengurangi sumber inokulum'
    ],
    chemicalRemedy: [
      'Fungisida triazol seperti Propikonazol atau Tebukonazol pada fase vegetatif akhir',
      'Fungisida strobilurin (Azoksistrobin) untuk perlindungan sistemik jangka panjang'
    ],
    prevention: [
      'Gunakan hibrida jagung tahan karat (tanda R pada label varietas)',
      'Tanam lebih awal sebelum musim hujan puncak untuk menghindari periode kritis infeksi',
      'Jaga jarak tanam dan lakukan pemupukan K (Kalium) yang cukup'
    ]
  },
  {
    id: 'jagung-hawar-utara',
    name: 'Hawar Daun Utara (Northern Leaf Blight)',
    latinName: 'Exserohilum turcicum',
    crop: 'Jagung',
    category: 'Jamur / Fungi',
    severityDefault: 'Sedang',
    imageUrl: localImages.cropJagungFarm,
    dataSource: 'PlantVillage Dataset (Kaggle)',
    symptoms: [
      'Lesi abu-abu kecokelatan berbentuk cerutu memanjang (5–15 cm) sejajar tulang daun',
      'Permukaan lesi tampak berbulu kehijauan saat sporulasi aktif pada kondisi lembap',
      'Lesi bergabung menyebabkan kematian daun besar-besaran dan penurunan berat tongkol'
    ],
    triggerConditions: 'Suhu moderat (18–27°C) dengan daun basah minimal 6 jam per hari, sering terjadi pada musim hujan.',
    organicRemedy: [
      'Pemangkasan daun bawah yang sakit untuk meningkatkan sirkulasi udara',
      'Aplikasi bio-fungisida Trichoderma viride atau Pseudomonas fluorescens pada daun'
    ],
    chemicalRemedy: [
      'Fungisida Klorotalonil, Propikonazol, atau Mankozeb saat infeksi terdeteksi dini',
      'Semprotan fungisida sistemik campuran Azoksistrobin + Propikonazol'
    ],
    prevention: [
      'Tanam varietas jagung hibrida tahan Ht1 atau Ht2 (Northern Leaf Blight Resistance)',
      'Rotasi tanaman dengan kedelai, kacang tanah, atau padi setiap 2 musim',
      'Bajak dan benamkan sisa tanaman dalam tanah setelah panen untuk mempercepat dekomposisi'
    ]
  },
  {
    id: 'jagung-bercak-abu',
    name: 'Bercak Daun Abu-abu (Gray Leaf Spot)',
    latinName: 'Cercospora zeae-maydis',
    crop: 'Jagung',
    category: 'Jamur / Fungi',
    severityDefault: 'Sedang',
    imageUrl: localImages.cropJagungFarm,
    dataSource: 'PlantVillage Dataset (Kaggle)',
    symptoms: [
      'Lesi persegi panjang sempit berwarna abu-abu kecokelatan dibatasi urat daun secara kaku',
      'Lesion terlihat semi-transparan saat daun diterawang terhadap cahaya matahari',
      'Infeksi berat menyebabkan seluruh daun mengering berwarna abu-abu seperti terbakar'
    ],
    triggerConditions: 'Kelembapan tinggi persisten, suhu 25–30°C, embun pagi yang lama, dan residu tanaman yang banyak.',
    organicRemedy: [
      'Bajak tanah untuk membenamkan sisa tanaman jagung yang menjadi sumber inokulum utama',
      'Semprotkan larutan belerang organik atau bio-fungisida Trichoderma secara preventif'
    ],
    chemicalRemedy: [
      'Fungisida strobilurin (Azoksistrobin, Pikoksistrobin) atau campurannya dengan Triazol',
      'Aplikasi preventif sebelum bunga rambut muncul memberikan proteksi terbaik'
    ],
    prevention: [
      'Pilih varietas dengan ketahanan partial terhadap Gray Leaf Spot',
      'Rotasi tanaman dengan non-jagung setidaknya 1 musim untuk memutus siklus inokulum',
      'Hindari sistem no-tillage di lahan dengan riwayat GLS parah'
    ]
  },

  // ===== KENTANG =====
  {
    id: 'kentang-hawar-awal',
    name: 'Hawar Awal Kentang (Early Blight)',
    latinName: 'Alternaria solani',
    crop: 'Kentang',
    category: 'Jamur / Fungi',
    severityDefault: 'Sedang',
    imageUrl: localImages.featureHamaDaun,
    dataSource: 'PlantVillage Dataset (Kaggle)',
    symptoms: [
      'Bercak cokelat tua dengan cincin konsentris (target spot) pada daun tua bagian bawah',
      'Halo kuning mengelilingi bercak dan daun menguning sebelum rontok',
      'Lesi pada umbi membentuk cekungan gelap kering dengan tepi yang meninggi'
    ],
    triggerConditions: 'Suhu hangat (24–29°C) dengan periode pembasahan daun, tanaman dewasa atau stres nutrisi lebih rentan.',
    organicRemedy: [
      'Semprotan ekstrak bawang putih atau tembaga sulfat organik secara preventif',
      'Pemangkasan dan pemusnahan daun bawah yang terinfeksi secara berkala',
      'Perbaikan nutrisi dengan pupuk Kalium dan Kalsium untuk memperkuat jaringan'
    ],
    chemicalRemedy: [
      'Fungisida Mankozeb, Klorotalonil, atau Iprodion pada interval 7–10 hari',
      'Fungisida sistemik Azoksistrobin atau Difenokonazol untuk kuratif'
    ],
    prevention: [
      'Tanam umbi bibit yang bebas penyakit dari sumber bersertifikat',
      'Siram di pangkal batang (drip irrigation) untuk meminimalkan daun basah',
      'Rotasi tanaman kentang dengan serealia atau legum selama 3 tahun'
    ]
  },
  {
    id: 'kentang-hawar-akhir',
    name: 'Hawar Daun Kentang (Late Blight)',
    latinName: 'Phytophthora infestans',
    crop: 'Kentang',
    category: 'Jamur / Fungi',
    severityDefault: 'Berat',
    imageUrl: localImages.featureHamaDaun,
    dataSource: 'PlantVillage Dataset (Kaggle)',
    symptoms: [
      'Bercak basah berwarna hijau gelap di tepi daun yang cepat meluas menjadi hitam kecokelatan',
      'Lapisan jamur putih seperti bulu halus terlihat di bawah daun saat udara lembap',
      'Umbi membusuk dengan daging berwarna cokelat berkarat yang berbau tidak sedap'
    ],
    triggerConditions: 'Suhu sejuk (10–20°C) dengan kelembapan tinggi di atas 90%; khas di dataran tinggi saat musim hujan.',
    organicRemedy: [
      'Semprotan tembaga berbasis organik (copper octanoate) secara preventif tiap 5–7 hari',
      'Segera panen umbi jika lebih dari 25% tanaman menunjukkan gejala',
      'Buang dan bakar seluruh sisa tanaman yang terinfeksi'
    ],
    chemicalRemedy: [
      'Fungisida sistemik Metalaksil + Mankozeb atau Simoksanil + Mankozeb',
      'Fungisida kuratif Dimethomorph atau Amisulbrom untuk infeksi yang sudah berkembang'
    ],
    prevention: [
      'Gunakan varietas kentang tahan Late Blight seperti Granola L atau Balsa',
      'Hindari menanam di lokasi yang sebelumnya terinfeksi tanpa persiapan tanah yang baik',
      'Monitor cuaca harian, semprotkan fungisida preventif sebelum periode hujan panjang'
    ]
  },

  // ===== ANGGUR =====
  {
    id: 'anggur-busuk-hitam',
    name: 'Busuk Hitam Anggur (Black Rot)',
    latinName: 'Guignardia bidwellii',
    crop: 'Anggur',
    category: 'Jamur / Fungi',
    severityDefault: 'Berat',
    imageUrl: localImages.featureHamaDaun,
    dataSource: 'PlantVillage Dataset (Kaggle)',
    symptoms: [
      'Bercak cokelat kemerahan kecil pada daun yang berkembang menjadi lesi besar dengan tepi hitam',
      'Buah mengalami pembusukan cepat — berubah cokelat, mengkerut menjadi mumi hitam keras',
      'Titik hitam kecil (piknidia) berbaris rapi di tepi lesi pada daun dan buah kering'
    ],
    triggerConditions: 'Suhu hangat (20–30°C) dengan periode hujan dan kelembapan tinggi saat buah muda berkembang.',
    organicRemedy: [
      'Pangkas dan musnahkan buah mumi serta ranting mati sebagai sumber inokulum',
      'Semprotan larutan belerang (sulfur) organik atau tembaga hidroksi secara preventif',
      'Jaga kebersihan kebun dengan membersihkan daun gugur dan buah rontok'
    ],
    chemicalRemedy: [
      'Fungisida Mankozeb atau Kaptan diaplikasikan sejak tunas pecah hingga buah terbentuk',
      'Fungisida sistemik Miklobutanil atau Tebukonazol untuk pengendalian kuratif'
    ],
    prevention: [
      'Gunakan varietas anggur yang memiliki toleransi terhadap Black Rot',
      'Pangkas untuk membuka kanopi agar sinar matahari masuk dan daun cepat kering',
      'Terapkan mulsa di bawah kanopi untuk mencegah percikan spora dari tanah'
    ]
  },
  {
    id: 'anggur-esca',
    name: 'Esca / Black Measles Anggur',
    latinName: 'Phaeomoniella chlamydospora & Phaeoacremonium spp.',
    crop: 'Anggur',
    category: 'Jamur / Fungi',
    severityDefault: 'Berat',
    imageUrl: localImages.featureHamaDaun,
    dataSource: 'PlantVillage Dataset (Kaggle)',
    symptoms: [
      'Bercak kuning hijau antardaun dengan tepi cokelat kemerahan menyerupai pola harimau (tiger stripe)',
      'Buah anggur menunjukkan bintik ungu kehitaman kecil tersebar di seluruh permukaan',
      'Kayu tanaman terbelah menunjukkan pewarnaan cokelat gelap hingga hitam di jaringan pembuluh'
    ],
    triggerConditions: 'Infeksi melalui luka pemangkasan; berkembang lambat selama bertahun-tahun di dalam jaringan kayu.',
    organicRemedy: [
      'Olesi luka bekas pemangkasan dengan pasta tembaga atau cat pelindung luka segera setelah memangkas',
      'Pangkas jauh di bawah bagian kayu yang terinfeksi, disinfeksi gunting tiap potongan',
      'Tingkatkan kesehatan tanaman dengan pemupukan berimbang dan irigasi teratur'
    ],
    chemicalRemedy: [
      'Tidak ada fungisida kuratif yang efektif; penanganan utama bersifat preventif dan sanitasi',
      'Injeksi batang dengan fungisida Tifoxistrobin pernah dicoba dengan hasil bervariasi'
    ],
    prevention: [
      'Disinfeksi semua alat pemangkasan dengan alkohol 70% sebelum setiap potongan',
      'Lakukan pemangkasan pada musim kering dan hindari memangkas saat musim hujan',
      'Pilih bibit anggur bersertifikat bebas penyakit dari nursery terpercaya'
    ]
  },
  {
    id: 'anggur-hawar-daun',
    name: 'Hawar Daun Anggur (Leaf Blight)',
    latinName: 'Pseudocercospora vitis',
    crop: 'Anggur',
    category: 'Jamur / Fungi',
    severityDefault: 'Sedang',
    imageUrl: localImages.featureHamaDaun,
    dataSource: 'PlantVillage Dataset (Kaggle)',
    symptoms: [
      'Bercak cokelat tidak beraturan dengan tepi tidak jelas pada daun tua, sering dekat tulang daun',
      'Lesi bergabung hingga mencakup area besar daun dan menyebabkan defoliasi awal',
      'Bagian bawah daun pada area terinfeksi tampak sedikit berbulu keabu-abuan'
    ],
    triggerConditions: 'Cuaca lembap dan hangat, sirkulasi udara buruk di dalam kanopi anggur yang rapat.',
    organicRemedy: [
      'Pemangkasan rutin untuk membuka kanopi dan meningkatkan sirkulasi udara',
      'Semprotan campuran tembaga sulfat + kapur tohor (Bordeaux mixture) secara preventif',
      'Buang daun terinfeksi dan bersihkan lahan dari sisa-sisa organik'
    ],
    chemicalRemedy: [
      'Fungisida berbahan aktif Mankozeb, Klorotalonil, atau Trifloxystrobinaplicasikan preventif',
      'Fungisida sistemik seperti Difenokonazol untuk pengendalian kuratif'
    ],
    prevention: [
      'Pangkas dan bentuk tanaman anggur secara teratur agar kanopi tidak terlalu rapat',
      'Hindari penyiraman dari atas yang membasahi daun, gunakan irigasi tetes',
      'Rotasi fungisida untuk mencegah resistensi jamur terhadap bahan aktif tertentu'
    ]
  },

  // ===== STROBERI =====
  {
    id: 'stroberi-hangus-daun',
    name: 'Hangus Daun Stroberi (Leaf Scorch)',
    latinName: 'Diplocarpon earlianum',
    crop: 'Stroberi',
    category: 'Jamur / Fungi',
    severityDefault: 'Sedang',
    imageUrl: localImages.featureHamaDaun,
    dataSource: 'PlantVillage Dataset (Kaggle)',
    symptoms: [
      'Bercak ungu kemerahan kecil tidak beraturan pada permukaan atas daun',
      'Pusat bercak berubah cokelat muda hingga abu-abu di tengah, mirip mata burung',
      'Infeksi berat menyebabkan daun mengering seperti terbakar (scorch) dan rontok sebelum waktunya'
    ],
    triggerConditions: 'Kelembapan tinggi dan suhu 20–25°C; spora menyebar lewat percikan air hujan dan embun.',
    organicRemedy: [
      'Pangkas dan buang daun yang terinfeksi segera untuk mengurangi sumber spora',
      'Semprotan larutan tembaga organik atau ekstrak mimba secara preventif tiap 7–10 hari',
      'Gunakan mulsa jerami untuk mencegah percikan spora dari tanah ke daun bawah'
    ],
    chemicalRemedy: [
      'Fungisida Kaptan atau Mankozeb diaplikasikan preventif sebelum musim hujan',
      'Fungisida sistemik berbahan aktif Miklobutanil atau Azoksistrobin untuk kuratif'
    ],
    prevention: [
      'Gunakan varietas stroberi yang memiliki ketahanan terhadap Leaf Scorch',
      'Tanam dengan jarak cukup lebar agar sirkulasi udara baik dan daun cepat kering',
      'Hindari menyiram daun langsung; fokuskan irigasi di zona perakaran'
    ]
  },

  // ===== TANAH =====
  {
    id: 'tanah-masam',
    name: 'Kemasaman Tanah Tinggi (Low pH Stress)',
    latinName: 'Edaphic Soil Acidity (pH < 5.0)',
    crop: 'Tanah',
    category: 'Fisiologis / Nutrisi',
    severityDefault: 'Sedang',
    imageUrl: localImages.featurePupukTanah,
    symptoms: [
      'Permukaan tanah tampak kemerahan atau berkarat, keras saat kering, becek liat saat basah',
      'Ujung akar tanaman menebal tumpul berwarna cokelat gelap karena keracunan Aluminium (Al)',
      'Tanaman lambat tumbuh dan kerdil meskipun sudah diberi pupuk NPK'
    ],
    triggerConditions: 'Curah hujan tinggi yang mencuci basa-basa tanah, pemakaian pupuk kimia sintetis asam jangka panjang.',
    organicRemedy: [
      'Aplikasi pupuk kandang sapi atau kambing matang 10–20 ton/hektar',
      'Pemberian biochar arang sekam padi untuk meningkatkan Kapasitas Tukar Kation (KTK)',
      'Aplikasi mikroba pelarut fosfat dan penambat nitrogen'
    ],
    chemicalRemedy: [
      'Tabur Kapur Pertanian (Kaptan / Dolomit CaMg(CO3)2) dosis 1.5–3 ton/ha saat olah tanah',
      'Berikan pupuk SP-36 atau Rock Phosphate yang bereaksi lambat'
    ],
    prevention: [
      'Lakukan uji pH tanah rutin tiap awal musim tanam menggunakan pH meter atau kertas lakmus',
      'Kurangi pupuk berkarakter asam seperti ZA (Amonium Sulfat)',
      'Tanam tanaman penutup tanah (legume cover crops) untuk memperkaya bahan organik'
    ]
  }
];

