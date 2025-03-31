const channels = [
    {id: 31, name: "TNT Sports 1 UK"},
    {id: 32, name: "TNT Sports 2 UK"},
    {id: 33, name: "TNT Sports 3 UK"},
    {id: 34, name: "TNT Sports 4 UK"},
    {id: 35, name: "Sky Sports Football UK"},
    {id: 37, name: "Sky Sports Action UK"},
    {id: 38, name: "Sky Sports Main Event"},
    {id: 39, name: "FS1 USA"},
    {id: 41, name: "EuroSport 1 UK"},
    {id: 42, name: "EuroSport 2 UK"},
    {id: 44, name: "ESPN USA"},
    {id: 45, name: "ESPN2 USA"},
    {id: 51, name: "ABC WFAA Dallas"},
    {id: 52, name: "CBS WWJ Detroit"},
    {id: 53, name: "NBC WMAQ Chicago"},
    {id: 54, name: "FOX WSVN Miami"},
    {id: 60, name: "Sky Sports F1 UK"},
    {id: 65, name: "Sky Sports Cricket"},
    {id: 66, name: "TUDN USA"},
    {id: 111, name: "TSN 1"},
    {id: 112, name: "TSN 2"},
    {id: 113, name: "TSN 3"},
    {id: 114, name: "TSN 4"},
    {id: 115, name: "TSN 5"},
    {id: 130, name: "Sky Sports Premier League"},
    {id: 131, name: "Telemundo"},
    {id: 132, name: "Univision"},
    {id: 133, name: "Unimas"},
    {id: 210, name: "PBS USA"},
    {id: 267, name: "Star Sports 1 Hindi (Daddy)"},    
    {id: 269, name: "A Sport PK"},
    {id: 277, name: "NBC10 Philadelphia"},
    {id: 279, name: "FUSE TV USA"},
    {id: 280, name: "CW PIX 11 USA"},
    {id: 282, name: "StarzPlay CricLife 3 HD"},
    {id: 283, name: "StarzPlay CricLife 2 HD"},
    {id: 284, name: "StarzPlay CricLife 1 HD"},
    {id: 288, name: "ESPNews"},
    {id: 292, name: "NewsNation USA"},
    {id: 295, name: "Adult Swim"},
    {id: 298, name: "FXX USA"},
    {id: 300, name: "CW USA"},
    {id: 301, name: "Freeform"},
    {id: 302, name: "A&E USA"},
    {id: 303, name: "AMC USA"},
    {id: 305, name: "BBC America (BBCA)"},
    {id: 306, name: "BET USA"},
    {id: 307, name: "Bravo USA"},
    {id: 308, name: "CBS Sports Network (CBSSN)"},
    {id: 309, name: "CNBC USA"},
    {id: 310, name: "Comedy Central"},
    {id: 316, name: "ESPNU USA"},
    {id: 317, name: "FX USA"},
    {id: 318, name: "GOLF Channel USA"},
    {id: 319, name: "Game Show Network"},
    {id: 322, name: "History USA"},
    {id: 323, name: "HLN"},
    {id: 325, name: "ION USA"},
    {id: 327, name: "MSNBC"},
    {id: 328, name: "National Geographic (NGC)"},
    {id: 330, name: "NICK"},
    {id: 333, name: "Showtime"},
    {id: 334, name: "Paramount Network"},
    {id: 335, name: "Starz"},
    {id: 336, name: "TBS USA"},
    {id: 338, name: "TNT USA"},
    {id: 339, name: "Cartoon Network"},
    {id: 341, name: "TruTV USA"},
    {id: 342, name: "TVLAND"},
    {id: 343, name: "USA Network"},
    {id: 344, name: "VH1 USA"},
    {id: 345, name: "CNN USA"},
    {id: 346, name: "Willow Cricket"},
    {id: 349, name: "BBC News Channel HD"},
    {id: 350, name: "ITV 1 UK"},
    {id: 351, name: "ITV 2 UK"},
    {id: 352, name: "ITV 3 UK"},
    {id: 353, name: "ITV 4 UK"},
    {id: 354, name: "Channel 4 UK"},
    {id: 355, name: "Channel 5 UK"},
    {id: 356, name: "BBC One UK"},
    {id: 357, name: "BBC Two UK"},
    {id: 358, name: "BBC Three UK"},
    {id: 359, name: "BBC Four UK"},
    {id: 366, name: "Sky Sports News UK"},
    {id: 368, name: "SuperSport Cricket"},
    {id: 369, name: "Fox Cricket"},
    {id: 370, name: "Astro Cricket"},
    {id: 371, name: "MTV USA"},
    {id: 373, name: "SYFY USA"},
    {id: 374, name: "Cinemax USA"},
    {id: 375, name: "ESPN Deportes"},
    {id: 376, name: "WWE Network"},
    {id: 381, name: "FX Movie Channel"},
    {id: 384, name: "The Food Network"},
    {id: 385, name: "SEC Network USA"},
    {id: 394, name: "The Weather Channel"},
    {id: 397, name: "BIG TEN Network (BTN USA)"},
    {id: 399, name: "MLB Network USA"},
    {id: 404, name: "NBA TV USA"},
    {id: 405, name: "NFL Network"},
    {id: 424, name: "SuperSport Motorsport"},
    {id: 449, name: "Sky Sports MIX UK"},
    {id: 450, name: "PTV Sports"},
    {id: 451, name: "Premier Sports 1 UK"},
    {id: 587, name: "Sky Sport Select NZ"},
    {id: 588, name: "Sky Sport 1 NZ"},
    {id: 589, name: "Sky Sport 2 NZ"},
    {id: 590, name: "Sky Sport 3 NZ"},
    {id: 591, name: "Sky Sport 4 NZ"},
    {id: 592, name: "Sky Sport 5 NZ"},
    {id: 593, name: "Sky Sport 6 NZ"},
    {id: 594, name: "Sky Sport 7 NZ"},
    {id: 595, name: "Sky Sport 8 NZ"},
    {id: 596, name: "Sky Sport 9 NZ"},
    {id: 598, name: "Willow XTRA"},
    {id: 600, name: "Abu Dhabi Sports 1 UAE"},
    {id: 601, name: "Abu Dhabi Sports 2 UAE"},
    {id: 602, name: "CTV Canada"},
    {id: 608, name: "CBS Philadelphia"},
    {id: 609, name: "Abu Dhabi Sports 1 Premium"},
    {id: 610, name: "Abu Dhabi Sports 2 Premium"},
    {id: 643, name: "FOX Deportes USA"},
    {id: 646, name: "MAVTV USA"},
    {id: 647, name: "CMT USA"},
    {id: 654, name: "MY9TV USA"},
    {id: 656, name: "IFC TV USA"},
    {id: 659, name: "VICE TV"},
    {id: 661, name: "Motor Trend"},
    {id: 663, name: "NHL Network USA"},
    {id: 664, name: "ACC Network USA"},
    {id: 697, name: "Cooking Channel USA"},
    {id: 741, name: "Ten Sports PK"},
    {id: 742, name: "AXS TV USA"},
    {id: 748, name: "COZI TV USA"},
    {id: 750, name: "C SPAN 1"},
    {id: 753, name: "NBC Sports Bay Area"},
    {id: 754, name: "NBC Sports Boston"},
    {id: 755, name: "NBC Sports California"},
    {id: 756, name: "FOX Soccer Plus"},
    {id: 758, name: "FS2 USA"},
    {id: 759, name: "SportsNet New York (SNY)"},
    {id: 762, name: "NESN USA"},
    {id: 763, name: "YES Network USA"},
    {id: 764, name: "Spectrum Sportsnet LA"},
    {id: 765, name: "MSG USA"},
    {id: 766, name: "ABCNY WABC"},
    {id: 767, name: "CBSNY WCBS"},
    {id: 768, name: "FOXNY WNYW"},
    {id: 769, name: "NBCNY WNBC"},
    {id: 770, name: "Marquee Sports Network"},
    {id: 776, name: "Chicago Sports Network (CHSN)"},
    {id: 777, name: "NBC Sports Philadelphia"},
    {id: 778, name: "Monumental Sports Network"},
    {id: 799, name: "Premier Sports 2 UK"},
    {id: 820, name: "FOX Sports 502 AU"},
    {id: 821, name: "FOX Sports 503 AU"},
    {id: 822, name: "FOX Sports 504 AU"},
    {id: 823, name: "FOX Sports 505 AU"},
    {id: 824, name: "FOX Sports 506 AU"},
    {id: 825, name: "FOX Sports 507 AU"},
    {id: 829, name: "MASN USA"},
    {id: 832, name: "CBC CA"},
    {id: 836, name: "Global CA"},
    {id: 838, name: "CTV 2 Canada"},
    {id: 845, name: "Universo"},
    {id: 866, name: "Philly57"},
    {id: 881, name: "SONY TEN 3 HD"},
    {id: 885, name: "SONY TEN 1 HD"},
    {id: 886, name: "SONY TEN 2 HD"},
    {id: 891, name: "FanDuel Sports Detroit"},
    {id: 892, name: "FanDuel Sports Florida"},
    {id: 893, name: "FanDuel Sports Great Lakes"},
    {id: 894, name: "FanDuel Sports Indiana"},
    {id: 896, name: "FanDuel Sports Midwest"},
    {id: 898, name: "FanDuel Sports North"},
    {id: 899, name: "FanDuel Sports Ohio"},
    {id: 900, name: "FanDuel Sports Oklahoma"},
    {id: 902, name: "FanDuel Sports SoCal"},
    {id: 903, name: "FanDuel Sports South"},
    {id: 904, name: "FanDuel Sports Southeast"},
    {id: 905, name: "FanDuel Sports Sun"},
    {id: 906, name: "FanDuel Sports West"},
    {id: 907, name: "FanDuel Sports Wisconsin"},
    {id: 910, name: "CBS Sports Golazo"},
    {id: 920, name: "Root Sports Northwest"},
    {id: 921, name: "Space City Home Network"},
    {id: 923, name: "Altitude Sports"},
    {id: 925, name: "ESPN 1 MX"},
    {id: 926, name: "ESPN 2 MX"},
    {id: 927, name: "ESPN 3 MX"},
    {id: 928, name: "ESPN 4 MX"},
    {id: 929, name: "Fox Sports 1 MX"},
    {id: 930, name: "Fox Sports 2 MX"},
    {id: 931, name: "Fox Sports 3 MX"},
    {id: 'star1', name: 'Star Sports 1 English', customUrl: 'https://cdn.crichdplays.ru/embed2.php?id=starsp1'},
    {id: 'star1alt', name: 'Star Sports 1 English Alt', customUrl: 'https://stream.crichd.sc/update/star.php'},
    {id: 'star1h', name: 'Star Sports 1 Hindi', customUrl: 'https://stream.crichd.sc/update/star1hi.php'},
    {id: 'star2', name: 'Star Sports 2 English', customUrl: 'https://cdn.crichdplays.ru/embed2.php?id=starsp2'},
    {id: 'star2h', name: 'Star Sports 2 Hindi', customUrl: 'https://cdn.crichdplays.ru/embed2.php?id=starsp3'},
    {id: 'ptv', name: 'PTV Sports Alt', customUrl: 'https://stream.crichd.sc/update/ptv.php'},
    {id: 'asport', name: 'A Sports Alt', customUrl: 'https://stream.crichd.sc/update/asportshd.php'},
];
