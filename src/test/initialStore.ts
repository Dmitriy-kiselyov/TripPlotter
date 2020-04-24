import { IStore } from '../types/store';

export const testStore: IStore = {
    startTime: '08:00',
    endTime: '20:00',
    date: [
        new Date('2020-02-21'),
        new Date('2020-02-22')
    ],
    tripList: [
        {
            organization: {
                id: '111972923732',
                name: 'Парк львов тайган',
                address: 'Россия, Республика Крым, Белогорск',
                url: 'http://park-taigan.ru/',
                Phones: [
                    {
                        type: 'phone',
                        formatted: '+7 (978) 886-81-79'
                    }
                ],
                Categories: [
                    {
                        'class': 'zoo',
                        name: 'Зоопарк'
                    }
                ],
                Hours: {
                    text: 'ежедневно, круглосуточно',
                    Availabilities: [
                        {
                            TwentyFourHours: true,
                            Everyday: true
                        }
                    ]
                },
                geometry: {
                    type: 'Point',
                    coordinates: [
                        45.057123,
                        34.59997
                    ]
                }
            },
            category: 'zoo',
            time: '04:00'
        },
        {
            organization: {
                id: '53590591549',
                name: 'Пляж',
                address: 'Россия, Республика Крым, городской округ Судак, посёлок городского типа Новый Свет, Набережная улица',
                Categories: [
                    {
                        'class': 'beach',
                        name: 'Пляж'
                    }
                ],
                geometry: {
                    type: 'Point',
                    coordinates: [
                        44.830287,
                        34.918806
                    ]
                }
            },
            category: 'beach',
            time: '05:00'
        },
        {
            organization: {
                id: '40573545203',
                name: 'Конно-спортивный клуб Cowboy',
                address: 'Россия, Республика Крым, Белогорский район, село Белая Скала',
                url: 'http://extreme-cowboy.ru/',
                Phones: [
                    {
                        type: 'phone',
                        formatted: '+7 (978) 826-08-16'
                    }
                ],
                Categories: [
                    {
                        name: 'Пункт проката'
                    },
                    {
                        'class': 'equestrian',
                        name: 'Конный клуб'
                    },
                    {
                        name: 'Экскурсии'
                    },
                    {
                        'class': 'sanatorium',
                        name: 'Турбаза'
                    },
                    {
                        'class': 'travel',
                        name: 'Бронирование гостиниц'
                    }
                ],
                Hours: {
                    text: 'ежедневно, круглосуточно',
                    Availabilities: [
                        {
                            TwentyFourHours: true,
                            Everyday: true
                        }
                    ]
                },
                geometry: {
                    type: 'Point',
                    coordinates: [
                        45.098228,
                        34.625287
                    ]
                }
            },
            category: 'equestrian',
            time: '03:15'
        },
        {
            organization: {
                id: '132851386318',
                name: 'Пещера Эмине-Баир-Хосар',
                address: 'Россия, Республика Крым, Симферопольский район, Добровское сельское поселение',
                Categories: [
                    {
                        'class': 'forest',
                        name: 'Лесопарк, заповедник'
                    }
                ],
                Hours: {
                    text: 'ежедневно, 9:00–19:00',
                    Availabilities: [
                        {
                            Intervals: [
                                {
                                    from: '09:00:00',
                                    to: '19:00:00'
                                }
                            ],
                            Everyday: true
                        }
                    ]
                },
                geometry: {
                    type: 'Point',
                    coordinates: [
                        44.869632,
                        34.240079
                    ]
                }
            },
            category: 'park',
            time: '02:45'
        },
        {
            organization: {
                id: '1072971145',
                name: 'Зоологический музей при Таврической академии КФУ им. Вернадского',
                address: 'Россия, Республика Крым, Симферополь, проспект Академика Вернадского, 4',
                url: 'http://zoomuseum.net/',
                Phones: [
                    {
                        type: 'phone',
                        formatted: '+7 (978) 728-54-06'
                    },
                    {
                        type: 'phone',
                        formatted: '+7 (3652) 51-69-93'
                    }
                ],
                Categories: [
                    {
                        'class': 'museum',
                        name: 'Музей'
                    }
                ],
                Hours: {
                    text: 'ежедневно, 8:00–19:00',
                    Availabilities: [
                        {
                            Intervals: [
                                {
                                    from: '08:00:00',
                                    to: '19:00:00'
                                }
                            ],
                            Everyday: true
                        }
                    ]
                },
                geometry: {
                    type: 'Point',
                    coordinates: [
                        44.936479,
                        34.134633
                    ]
                }
            },
            category: 'museum',
            time: '02:00'
        },
        {
            organization: {
                id: '146475692173',
                name: 'Южная Демерджи',
                address: 'Россия, Республика Крым, городской округ Алушта',
                Categories: [
                    {
                        'class': 'mountain',
                        name: 'Горная вершина'
                    }
                ],
                geometry: {
                    type: 'Point',
                    coordinates: [
                        44.754472,
                        34.409678
                    ]
                }
            },
            category: 'mountain',
            time: '02:00'
        },
        {
            organization: {
                id: '35908130183',
                name: 'Художественная мастерская Eseniart',
                address: 'Россия, Республика Крым, Ялта, улица Тимирязева, 37',
                Phones: [
                    {
                        type: 'phone',
                        formatted: '+7 (978) 798-82-65'
                    }
                ],
                Categories: [
                    {
                        'class': 'gallery',
                        name: 'Художественная мастерская'
                    },
                    {
                        'class': 'giftshop',
                        name: 'Магазин подарков и сувениров'
                    },
                    {
                        name: 'Студия графического дизайна'
                    }
                ],
                Hours: {
                    text: 'пн-пт 9:00–18:00',
                    Availabilities: [
                        {
                            Intervals: [
                                {
                                    from: '09:00:00',
                                    to: '18:00:00'
                                }
                            ],
                            Monday: true,
                            Tuesday: true,
                            Wednesday: true,
                            Thursday: true,
                            Friday: true
                        }
                    ]
                },
                geometry: {
                    type: 'Point',
                    coordinates: [
                        44.498257,
                        34.140966
                    ]
                }
            },
            category: 'gallery',
            time: '03:00'
        },
        {
            organization: {
                id: '179892968027',
                name: 'Коннект Экспо',
                address: 'Россия, Республика Крым, городской округ Симферополь, посёлок городского типа Аэрофлотский, площадь Аэропорта, 6',
                url: 'https://connectexpo.ru/',
                Phones: [
                    {
                        type: 'phone',
                        formatted: '+7 (499) 350-45-64'
                    },
                    {
                        type: 'phone',
                        formatted: '+7 (978) 970-99-11'
                    }
                ],
                Categories: [
                    {
                        'class': 'exhibition center',
                        name: 'Выставочный центр'
                    },
                    {
                        'class': 'office',
                        name: 'Конференц-зал'
                    }
                ],
                Hours: {
                    text: 'пн-пт 9:00–20:00',
                    Availabilities: [
                        {
                            Intervals: [
                                {
                                    from: '09:00:00',
                                    to: '20:00:00'
                                }
                            ],
                            Monday: true,
                            Tuesday: true,
                            Wednesday: true,
                            Thursday: true,
                            Friday: true
                        }
                    ]
                },
                geometry: {
                    type: 'Point',
                    coordinates: [
                        45.020785,
                        33.997681
                    ]
                }
            },
            category: 'exhibition center',
            time: '04:00'
        }
    ]
};
