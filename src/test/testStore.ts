import { IStore } from '../types/store';

export const testStore: IStore = {
    startTime: '08:00',
    endTime: '20:00',
    date: [
        new Date('2020-02-20'),
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
                },
                extra: {
                    rating: 4.5,
                    count: 436
                }
            },
            category: 'zoo',
            time: '04:00'
        },
        {
            organization: {
                id: '114098162199',
                name: 'Пляж Золотой песок',
                address: 'Россия, Республика Крым, городской округ Феодосия, посёлок городского типа Приморский, Керченская улица',
                Categories: [
                    {
                        'class': 'beach',
                        name: 'Пляж'
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
                        45.1102,
                        35.475235
                    ]
                },
                extra: {
                    rating: 4.4,
                    count: 671
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
                },
                extra: {
                    rating: 4.7,
                    count: 69
                }
            },
            category: 'equestrian',
            time: '03:15'
        },
        {
            organization: {
                id: '183504073061',
                name: 'Никитский ботанический сад',
                address: 'Россия, Республика Крым, городской округ Ялта, Никитский ботанический сад',
                url: 'http://nikitasad.ru/',
                Phones: [
                    {
                        type: 'phone',
                        formatted: '+7 (978) 902-63-05'
                    },
                    {
                        type: 'phone',
                        formatted: '+7 (978) 902-63-07'
                    },
                    {
                        type: 'phone',
                        formatted: '+7 (978) 902-63-06'
                    },
                    {
                        type: 'phone',
                        formatted: '+7 (3654) 25-05-30'
                    }
                ],
                Categories: [
                    {
                        'class': 'science',
                        name: 'НИИ'
                    },
                    {
                        'class': 'park',
                        name: 'Парк культуры и отдыха'
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
                        44.510934,
                        34.232675
                    ]
                },
                extra: {
                    rating: 5,
                    count: 3675
                }
            },
            category: 'park',
            time: '02:00'
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
                },
                extra: {
                    rating: 4.2,
                    count: 61
                }
            },
            category: 'museum',
            time: '02:00'
        },
        {
            organization: {
                id: '85882530676',
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
                        44.749393,
                        34.414683
                    ]
                },
                extra: {
                    rating: 5,
                    count: 86
                }
            },
            category: 'mountain',
            time: '01:45'
        },
        {
            organization: {
                id: '145634383215',
                name: 'Художественная Школа-Мастерская',
                address: 'Россия, Республика Крым, Симферополь, улица Куйбышева, 2',
                url: 'https://художественная-школа-симферополь.рф/',
                Phones: [
                    {
                        type: 'phone',
                        formatted: '+7 (978) 090-53-33'
                    },
                    {
                        type: 'phone',
                        formatted: '+7 (978) 745-55-71'
                    }
                ],
                Categories: [
                    {
                        'class': 'further education',
                        name: 'Школа искусств'
                    },
                    {
                        'class': 'further education',
                        name: 'Дополнительное образование'
                    },
                    {
                        'class': 'gallery',
                        name: 'Художественная мастерская'
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
                        44.959987,
                        34.109346
                    ]
                },
                extra: {
                    rating: 4.4,
                    count: 32
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
                },
                extra: {
                    rating: 4,
                    count: 120
                }
            },
            category: 'exhibition center',
            time: '04:00'
        }
    ],
    location: {
        coords: [
            44.956358,
            34.116407
        ],
        address: 'улица Блюхера, 3, Симферополь, Республика Крым, Россия',
        auto: false
    }
};
