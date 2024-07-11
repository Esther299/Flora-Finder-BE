const bcrypt = require("bcrypt");

const seedUsers = [
  {
    username: "Yusha",
    name: "Yusha Rooshenas",
    email: "yusha@hotmail.com",
    password: bcrypt.hashSync("FloraSquad5", 10),
    avatar: "https://upload.wikimedia.org/wikipedia/en/5/53/Scooby-Doo.png",
  },
  {
    username: "James",
    name: "James Wallace",
    email: "james@gmail.com",
    password: bcrypt.hashSync("FloraSquad5", 10),
    avatar: "https://upload.wikimedia.org/wikipedia/en/8/87/ShaggyRogers.png",
  },
  {
    username: "Esther",
    name: "Esther Gines",
    email: "esther@yahoo.com",
    password: bcrypt.hashSync("FloraSquad5", 10),
    avatar: "https://upload.wikimedia.org/wikipedia/en/9/9d/Velma_Dinkley.png",
  },
  {
    username: "Alex",
    name: "Alex Hughes",
    email: "alex@googlemail.com",
    password: bcrypt.hashSync("FloraSquad5", 10),
    avatar: "https://upload.wikimedia.org/wikipedia/en/4/47/Fred_Jones.png",
  },
  {
    username: "Kate",
    name: "Kate Blacklock",
    email: "kate@xataka.com",
    password: bcrypt.hashSync("FloraSquad5", 10),
    avatar: "https://upload.wikimedia.org/wikipedia/en/1/1d/Daphne_Blake.png",
  },
  {
    username: "Saleh",
    name: "Daniel Saleh",
    email: "saleh@northcoders.com",
    password: bcrypt.hashSync("FloraSquad5", 10),
    avatar:
      "https://i.pinimg.com/originals/8b/9d/05/8b9d05cf886a341b6a5846213a3d329e.png",
  },
  {
    username: "Modou",
    name: "Modou Robinson",
    email: "modou@northcoders.com",
    password: bcrypt.hashSync("FloraSquad5", 10),
    avatar:
      "https://i.pinimg.com/originals/8b/9d/05/8b9d05cf886a341b6a5846213a3d329e.png",
  },
  {
    username: "Scarlett",
    name: "Scarlett Adams",
    email: "scarlett@northcoders.com",
    password: bcrypt.hashSync("FloraSquad5", 10),
    avatar:
      "https://i.pinimg.com/originals/8b/9d/05/8b9d05cf886a341b6a5846213a3d329e.png",
  },
  {
    username: "Stephen",
    name: "Stephen Corke",
    email: "stephen@northcoders.com",
    password: bcrypt.hashSync("FloraSquad5", 10),
    avatar:
      "https://i.pinimg.com/originals/8b/9d/05/8b9d05cf886a341b6a5846213a3d329e.png",
  },
  {
    username: "Linda",
    name: "Linda Güster",
    email: "linda@northcoders.com",
    password: bcrypt.hashSync("FloraSquad5", 10),
    avatar:
      "https://i.pinimg.com/originals/8b/9d/05/8b9d05cf886a341b6a5846213a3d329e.png",
  },
  {
    username: "Harrison",
    name: "Harrison Royds",
    email: "harrison@northcoders.com",
    password: bcrypt.hashSync("FloraSquad5", 10),
    avatar:
      "https://i.pinimg.com/originals/8b/9d/05/8b9d05cf886a341b6a5846213a3d329e.png",
  },
  {
    username: "Rayhaan",
    name: "Rayhaan Ugharadar",
    email: "rayhaan@northcoders.com",
    password: bcrypt.hashSync("FloraSquad5", 10),
    avatar:
      "https://i.pinimg.com/originals/8b/9d/05/8b9d05cf886a341b6a5846213a3d329e.png",
  },
  {
    username: "Ali",
    name: "Ali Abdallah",
    email: "ali@northcoders.com",
    password: bcrypt.hashSync("FloraSquad5", 10),
    avatar:
      "https://i.pinimg.com/originals/8b/9d/05/8b9d05cf886a341b6a5846213a3d329e.png",
  },
  {
    username: "Harriet",
    name: "Harriet Mallion",
    email: "harriet@northcoders.com",
    password: bcrypt.hashSync("FloraSquad5", 10),
    avatar:
      "https://i.pinimg.com/originals/8b/9d/05/8b9d05cf886a341b6a5846213a3d329e.png",
  },
];

const seedCollections = [
  {
    username: "Yusha",
    speciesID: 1,
    speciesName: "Rose",
    geoTag: JSON.stringify({
      latitude: 51.5074,
      longitude: -0.1278,
    }),
    matchScore: "0.23",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/1/1f/A_close-up_of_climbing_roses.jpg",
    speciesFamily: "Rosaceae",
  },
  {
    username: "Yusha",
    speciesID: 6,
    speciesName: "Daisy",
    geoTag: JSON.stringify({
      latitude: 51.509865,
      longitude: -0.118092,
    }),
    matchScore: "0.34",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/e/ef/Bidens_flwr.jpg",
    speciesFamily: "Asteraceae",
  },
  {
    username: "Yusha",
    speciesID: 7,
    speciesName: "Bluebell",
    geoTag: JSON.stringify({
      latitude: 51.5147,
      longitude: -0.1074,
    }),
    matchScore: "0.56",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/5/55/2401_Bluebells.jpg",
    speciesFamily: "Asparagaceae",
  },
  {
    username: "Yusha",
    speciesID: 8,
    speciesName: "Poppy",
    geoTag: JSON.stringify({
      latitude: 51.5194,
      longitude: -0.1276,
    }),
    matchScore: "0.41",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/7/71/Poppies_in_the_Sunset_on_Lake_Geneva.jpg",
    speciesFamily: "Papaveraceae",
  },

  {
    username: "James",
    speciesID: 2,
    speciesName: "Tulip",
    geoTag: JSON.stringify({
      latitude: 52.4862,
      longitude: -1.8904,
    }),
    matchScore: "0.67",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/c/c4/Tulipa_orphanidea_060506.jpg",
    speciesFamily: "Liliaceae",
  },
  {
    username: "James",
    speciesID: 9,
    speciesName: "Snowdrop",
    geoTag: JSON.stringify({
      latitude: 52.4855,
      longitude: -1.8894,
    }),
    matchScore: "0.49",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/2/23/Galanthus_nivalis.jpg",
    speciesFamily: "Amaryllidaceae",
  },
  {
    username: "James",
    speciesID: 10,
    speciesName: "Lavender",
    geoTag: JSON.stringify({
      latitude: 52.4892,
      longitude: -1.8925,
    }),
    matchScore: "0.55",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/7/7e/Single_lavender_flower02.jpg",
    speciesFamily: "Lamiaceae",
  },
  {
    username: "James",
    speciesID: 11,
    speciesName: "Foxglove",
    geoTag: JSON.stringify({
      latitude: 52.4814,
      longitude: -1.898,
    }),
    matchScore: "0.38",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/7/74/Digitalis_purpurea2.jpg",
    speciesFamily: "Plantaginaceae",
  },

  {
    username: "Esther",
    speciesID: 3,
    speciesName: "Sunflower",
    geoTag: JSON.stringify({
      latitude: 53.483959,
      longitude: -2.244644,
    }),
    matchScore: "0.45",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/4/40/Sunflower_sky_backdrop.jpg",
    speciesFamily: "Asteraceae",
  },
  {
    username: "Esther",
    speciesID: 12,
    speciesName: "Holly",
    geoTag: JSON.stringify({
      latitude: 53.4868,
      longitude: -2.2426,
    }),
    matchScore: "0.32",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/9/96/Ilex-aquifolium_%28Europaeische_Stechpalme-1%29.jpg",
    speciesFamily: "Aquifoliaceae",
  },
  {
    username: "Esther",
    speciesID: 13,
    speciesName: "Buttercup",
    geoTag: JSON.stringify({
      latitude: 53.4876,
      longitude: -2.2439,
    }),
    matchScore: "0.58",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/d/d9/Ranunculus_eschscholtzii.jpg",
    speciesFamily: "Ranunculaceae",
  },
  {
    username: "Esther",
    speciesID: 14,
    speciesName: "Heather",
    geoTag: JSON.stringify({
      latitude: 53.4827,
      longitude: -2.2455,
    }),
    matchScore: "0.39",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/6/64/Leptecophylla_juniperina.jpg",
    speciesFamily: "Ericaceae",
  },

  {
    username: "Alex",
    speciesID: 4,
    speciesName: "Daffodil",
    geoTag: JSON.stringify({
      latitude: 54.978252,
      longitude: -1.617439,
    }),
    matchScore: "0.12",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/9/96/A_Perfect_Pair_Daffodills_%28Narcissus%29_-_8.jpg",
    speciesFamily: "Amaryllidaceae",
  },
  {
    username: "Alex",
    speciesID: 15,
    speciesName: "Thistle",
    geoTag: JSON.stringify({
      latitude: 54.979,
      longitude: -1.6182,
    }),
    matchScore: "0.25",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/9/9f/Milk_thistle_flowerhead.jpg",
    speciesFamily: "Asteraceae",
  },
  {
    username: "Alex",
    speciesID: 16,
    speciesName: "Primrose",
    geoTag: JSON.stringify({
      latitude: 54.9773,
      longitude: -1.6166,
    }),
    matchScore: "0.31",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/a/ad/Prole%C4%87no_cve%C4%87e_3.JPG",
    speciesFamily: "Primulaceae",
  },
  {
    username: "Alex",
    speciesID: 17,
    speciesName: "Foxglove",
    geoTag: JSON.stringify({
      latitude: 54.9761,
      longitude: -1.6177,
    }),
    matchScore: "0.48",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/7/74/Digitalis_purpurea2.jpg",
    speciesFamily: "Plantaginaceae",
  },

  {
    username: "Kate",
    speciesID: 5,
    speciesName: "Lily",
    geoTag: JSON.stringify({
      latitude: 51.454513,
      longitude: -2.58791,
    }),
    matchScore: "0.65",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/3/30/Lilium_candidum_1.jpg",
    speciesFamily: "Liliaceae",
  },
  {
    username: "Kate",
    speciesID: 18,
    speciesName: "Rosemary",
    geoTag: JSON.stringify({
      latitude: 51.4551,
      longitude: -2.5891,
    }),
    matchScore: "0.52",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/a/a3/Rosemary_in_bloom.JPG",
    speciesFamily: "Lamiaceae",
  },
  {
    username: "Kate",
    speciesID: 19,
    speciesName: "Honeysuckle",
    geoTag: JSON.stringify({
      latitude: 51.4562,
      longitude: -2.5873,
    }),
    matchScore: "0.43",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/2/2f/Lonicera_caprifolium001.jpg",
    speciesFamily: "Caprifoliaceae",
  },
  {
    username: "Kate",
    speciesID: 20,
    speciesName: "Daisy",
    geoTag: JSON.stringify({
      latitude: 51.4533,
      longitude: -2.5885,
    }),
    matchScore: "0.29",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/e/ef/Bidens_flwr.jpg",
    speciesFamily: "Asteraceae",
  },

  {
    username: "Saleh",
    speciesID: 6,
    speciesName: "Clover",
    geoTag: JSON.stringify({
      latitude: 53.8008,
      longitude: -1.5491,
    }),
    matchScore: "0.37",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/c/c0/4-leaf_clover.JPG",
    speciesFamily: "Fabaceae",
  },
  {
    username: "Saleh",
    speciesID: 7,
    speciesName: "Dandelion",
    geoTag: JSON.stringify({
      latitude: 53.8012,
      longitude: -1.5488,
    }),
    matchScore: "0.43",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/5/54/TaraxacumOfficinaleSeed.JPG",
    speciesFamily: "Asteraceae",
  },
  {
    username: "Saleh",
    speciesID: 8,
    speciesName: "Fern",
    geoTag: JSON.stringify({
      latitude: 53.8004,
      longitude: -1.5485,
    }),
    matchScore: "0.39",
    image: "https://upload.wikimedia.org/wikipedia/commons/6/6e/Fern.jpg",
    speciesFamily: "Polypodiopsida",
  },
  {
    username: "Saleh",
    speciesID: 9,
    speciesName: "Bluebell",
    geoTag: JSON.stringify({
      latitude: 53.7998,
      longitude: -1.5482,
    }),
    matchScore: "0.48",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/4/4e/Hyacinthoides_non-scripta_0505.jpg",
    speciesFamily: "Asparagaceae",
  },

  {
    username: "Modou",
    speciesID: 21,
    speciesName: "Buttercup",
    geoTag: JSON.stringify({
      latitude: 52.4068,
      longitude: -1.5197,
    }),
    matchScore: "0.33",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/0/0c/Ranunculus_repens1.jpg",
    speciesFamily: "Ranunculaceae",
  },
  {
    username: "Modou",
    speciesID: 22,
    speciesName: "Violet",
    geoTag: JSON.stringify({
      latitude: 52.4054,
      longitude: -1.5149,
    }),
    matchScore: "0.47",
    image: "https://upload.wikimedia.org/wikipedia/commons/4/42/Viola_.jpg",
    speciesFamily: "Violaceae",
  },
  {
    username: "Modou",
    speciesID: 23,
    speciesName: "Daffodil",
    geoTag: JSON.stringify({
      latitude: 52.4036,
      longitude: -1.5145,
    }),
    matchScore: "0.29",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/9/96/A_Perfect_Pair_Daffodills_%28Narcissus%29_-_8.jpg",
    speciesFamily: "Amaryllidaceae",
  },
  {
    username: "Modou",
    speciesID: 24,
    speciesName: "Holly",
    geoTag: JSON.stringify({
      latitude: 52.4048,
      longitude: -1.5129,
    }),
    matchScore: "0.41",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/0/05/Holly_Ilex_aquifolium_Berry_2.jpg",
    speciesFamily: "Aquifoliaceae",
  },

  {
    username: "Scarlett",
    speciesID: 25,
    speciesName: "Rose",
    geoTag: JSON.stringify({
      latitude: 52.2007,
      longitude: -0.8854,
    }),
    matchScore: "0.56",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/1/1f/A_close-up_of_climbing_roses.jpg",
    speciesFamily: "Rosaceae",
  },
  {
    username: "Scarlett",
    speciesID: 26,
    speciesName: "Bluebell",
    geoTag: JSON.stringify({
      latitude: 52.2011,
      longitude: -0.8882,
    }),
    matchScore: "0.41",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/4/4e/Hyacinthoides_non-scripta_0505.jpg",
    speciesFamily: "Asparagaceae",
  },
  {
    username: "Scarlett",
    speciesID: 27,
    speciesName: "Snowdrop",
    geoTag: JSON.stringify({
      latitude: 52.2023,
      longitude: -0.8845,
    }),
    matchScore: "0.38",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/7/7d/Snowdrop_-_Galantamine.jpg",
    speciesFamily: "Amaryllidaceae",
  },
  {
    username: "Scarlett",
    speciesID: 28,
    speciesName: "Tulip",
    geoTag: JSON.stringify({
      latitude: 52.1999,
      longitude: -0.8868,
    }),
    matchScore: "0.42",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/c/c4/Tulipa_orphanidea_060506.jpg",
    speciesFamily: "Liliaceae",
  },

  {
    username: "Stephen",
    speciesID: 29,
    speciesName: "Daisy",
    geoTag: JSON.stringify({
      latitude: 52.4081,
      longitude: -1.5105,
    }),
    matchScore: "0.47",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/3/33/Bellis_perennis_white_2005.06.12_09.11.54.jpg",
    speciesFamily: "Asteraceae",
  },
  {
    username: "Stephen",
    speciesID: 30,
    speciesName: "Lavender",
    geoTag: JSON.stringify({
      latitude: 52.4093,
      longitude: -1.5118,
    }),
    matchScore: "0.36",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/a/ab/Lavandula_angustifolia%2C_Lamiaceae%2C_Lavender%2C_English_Lavender.jpg",
    speciesFamily: "Lamiaceae",
  },
  {
    username: "Stephen",
    speciesID: 31,
    speciesName: "Foxglove",
    geoTag: JSON.stringify({
      latitude: 52.4076,
      longitude: -1.5122,
    }),
    matchScore: "0.54",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/7/7c/Digitalis_purpurea.jpg",
    speciesFamily: "Plantaginaceae",
  },
  {
    username: "Stephen",
    speciesID: 32,
    speciesName: "Rose",
    geoTag: JSON.stringify({
      latitude: 52.4088,
      longitude: -1.5141,
    }),
    matchScore: "0.29",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/1/1f/A_close-up_of_climbing_roses.jpg",
    speciesFamily: "Rosaceae",
  },

  {
    username: "Linda",
    speciesID: 33,
    speciesName: "Sunflower",
    geoTag: JSON.stringify({
      latitude: 51.5094,
      longitude: -0.1273,
    }),
    matchScore: "0.53",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/4/40/Sunflower_sky_backdrop.jpg",
    speciesFamily: "Asteraceae",
  },
  {
    username: "Linda",
    speciesID: 34,
    speciesName: "Poppy",
    geoTag: JSON.stringify({
      latitude: 51.5085,
      longitude: -0.1281,
    }),
    matchScore: "0.45",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/0/0b/Papaver_rhoeas_-_Kew_1.jpg",
    speciesFamily: "Papaveraceae",
  },
  {
    username: "Linda",
    speciesID: 35,
    speciesName: "Thistle",
    geoTag: JSON.stringify({
      latitude: 51.5102,
      longitude: -0.1257,
    }),
    matchScore: "0.38",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/4/4b/Cirsium_vulgare_bluete.jpeg",
    speciesFamily: "Asteraceae",
  },
  {
    username: "Linda",
    speciesID: 36,
    speciesName: "Buttercup",
    geoTag: JSON.stringify({
      latitude: 51.5114,
      longitude: -0.1249,
    }),
    matchScore: "0.42",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/0/0c/Ranunculus_repens1.jpg",
    speciesFamily: "Ranunculaceae",
  },

  {
    username: "Harrison",
    speciesID: 37,
    speciesName: "Heather",
    geoTag: JSON.stringify({
      latitude: 54.5742,
      longitude: -1.2341,
    }),
    matchScore: "0.47",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/b/bb/Calluna_vulgaris_001.jpg",
    speciesFamily: "Ericaceae",
  },
  {
    username: "Harrison",
    speciesID: 38,
    speciesName: "Violet",
    geoTag: JSON.stringify({
      latitude: 54.5738,
      longitude: -1.2357,
    }),
    matchScore: "0.39",
    image: "https://upload.wikimedia.org/wikipedia/commons/4/42/Viola_.jpg",
    speciesFamily: "Violaceae",
  },
  {
    username: "Harrison",
    speciesID: 39,
    speciesName: "Fern",
    geoTag: JSON.stringify({
      latitude: 54.5751,
      longitude: -1.2365,
    }),
    matchScore: "0.29",
    image: "https://upload.wikimedia.org/wikipedia/commons/6/6e/Fern.jpg",
    speciesFamily: "Polypodiopsida",
  },
  {
    username: "Harrison",
    speciesID: 40,
    speciesName: "Snowdrop",
    geoTag: JSON.stringify({
      latitude: 54.5729,
      longitude: -1.2332,
    }),
    matchScore: "0.54",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/7/7d/Snowdrop_-_Galantamine.jpg",
    speciesFamily: "Amaryllidaceae",
  },

  {
    username: "Rayhaan",
    speciesID: 41,
    speciesName: "Tulip",
    geoTag: JSON.stringify({
      latitude: 53.3878,
      longitude: -1.4639,
    }),
    matchScore: "0.44",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/c/c4/Tulipa_orphanidea_060506.jpg",
    speciesFamily: "Liliaceae",
  },
  {
    username: "Rayhaan",
    speciesID: 42,
    speciesName: "Bluebell",
    geoTag: JSON.stringify({
      latitude: 53.3884,
      longitude: -1.4627,
    }),
    matchScore: "0.38",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/4/4e/Hyacinthoides_non-scripta_0505.jpg",
    speciesFamily: "Asparagaceae",
  },
  {
    username: "Rayhaan",
    speciesID: 43,
    speciesName: "Lavender",
    geoTag: JSON.stringify({
      latitude: 53.3891,
      longitude: -1.4615,
    }),
    matchScore: "0.57",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/a/ab/Lavandula_angustifolia%2C_Lamiaceae%2C_Lavender%2C_English_Lavender.jpg",
    speciesFamily: "Lamiaceae",
  },
  {
    username: "Rayhaan",
    speciesID: 44,
    speciesName: "Daisy",
    geoTag: JSON.stringify({
      latitude: 53.3885,
      longitude: -1.4634,
    }),
    matchScore: "0.32",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/3/33/Bellis_perennis_white_2005.06.12_09.11.54.jpg",
    speciesFamily: "Asteraceae",
  },

  {
    username: "Ali",
    speciesID: 45,
    speciesName: "Holly",
    geoTag: JSON.stringify({
      latitude: 51.4541,
      longitude: -0.9786,
    }),
    matchScore: "0.41",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/0/05/Holly_Ilex_aquifolium_Berry_2.jpg",
    speciesFamily: "Aquifoliaceae",
  },
  {
    username: "Ali",
    speciesID: 46,
    speciesName: "Sunflower",
    geoTag: JSON.stringify({
      latitude: 51.4545,
      longitude: -0.9774,
    }),
    matchScore: "0.52",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/4/40/Sunflower_sky_backdrop.jpg",
    speciesFamily: "Asteraceae",
  },
  {
    username: "Ali",
    speciesID: 47,
    speciesName: "Foxglove",
    geoTag: JSON.stringify({
      latitude: 51.4537,
      longitude: -0.9792,
    }),
    matchScore: "0.39",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/7/7c/Digitalis_purpurea.jpg",
    speciesFamily: "Plantaginaceae",
  },
  {
    username: "Ali",
    speciesID: 48,
    speciesName: "Primrose",
    geoTag: JSON.stringify({
      latitude: 51.455,
      longitude: -0.9761,
    }),
    matchScore: "0.33",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/4/4b/Primula_vulgaris_Bamberg_2016-04-14_01.jpg",
    speciesFamily: "Primulaceae",
  },

  {
    username: "Harriet",
    speciesID: 49,
    speciesName: "Lily",
    geoTag: JSON.stringify({
      latitude: 50.8225,
      longitude: -0.1372,
    }),
    matchScore: "0.55",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/e/e7/Lilium_Golden_Splendour3.jpg",
    speciesFamily: "Liliaceae",
  },
  {
    username: "Harriet",
    speciesID: 50,
    speciesName: "Rosemary",
    geoTag: JSON.stringify({
      latitude: 50.8237,
      longitude: -0.1386,
    }),
    matchScore: "0.43",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/6/6f/Rosmarinus_officinalis_03.jpg",
    speciesFamily: "Lamiaceae",
  },
  {
    username: "Harriet",
    speciesID: 51,
    speciesName: "Honeysuckle",
    geoTag: JSON.stringify({
      latitude: 50.8213,
      longitude: -0.1365,
    }),
    matchScore: "0.47",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/6/64/Lonicera_caprifolium_a1.jpg",
    speciesFamily: "Caprifoliaceae",
  },
  {
    username: "Harriet",
    speciesID: 52,
    speciesName: "Buttercup",
    geoTag: JSON.stringify({
      latitude: 50.8221,
      longitude: -0.1379,
    }),
    matchScore: "0.38",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/0/0c/Ranunculus_repens1.jpg",
    speciesFamily: "Ranunculaceae",
  },
];

module.exports = { seedUsers, seedCollections };
