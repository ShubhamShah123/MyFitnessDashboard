export const ImagePath = "../images"

export const menu = [
  {
    id: 1,
    title: "Main",
    listItems: [
      {
        id: 1,
        title: "Homepage",
        url: "/",
        icon: "home.svg",
      },
      {
        id: 2,
        title: "Profile",
        url: "/users/1",
        icon: "user.svg",
      },
    ],
  },
  {
    id: 2,
    title: "Lists",
    listItems: [
      {
        id: 1,
        title: "Users",
        url: "/users",
        icon: "user.svg",
      },
      {
        id: 2,
        title: "Workout Schedule",
        url: "/workout_schedule",
        icon: "product.svg",
      },
      {
        id: 3,
        title: "Meals information",
        url: "/meals_info",
        icon: "post2.svg",
      },
      {
        id: 4,
        title: "Get Progress",
        url: "/get_progress",
        icon: "order.svg",
      },
      {
        id: 5,
        title: "Update Progess",
        url: "/upload_progress",
        icon: "post2.svg",
      },
    ],
  },
  {
    id: 3,
    title: "General",
    listItems: [
      {
        id: 1,
        title: "Update Exercises",
        url: "/",
        icon: "element.svg",
      },
      {
        id: 2,
        title: "Update Meals",
        url: "/",
        icon: "note.svg",
      },
      {
        id: 3,
        title: "Forms",
        url: "/",
        icon: "form.svg",
      },
      {
        id: 4,
        title: "Calendar",
        url: "/",
        icon: "calendar.svg",
      },
    ],
  },
  {
    id: 4,
    title: "Maintenance",
    listItems: [
      {
        id: 1,
        title: "Settings",
        url: "/",
        icon: "setting.svg",
      },
      {
        id: 2,
        title: "Backups",
        url: "/",
        icon: "backup.svg",
      },
    ],
  },
  {
    id: 5,
    title: "Analytics",
    listItems: [
      {
        id: 1,
        title: "Charts",
        url: "/",
        icon: "chart.svg",
      },
      {
        id: 2,
        title: "Logs",
        url: "/",
        icon: "log.svg",
      },
    ],
  },
];

export const topDealUsers = [
  {
    id: 1,
    img: "https://images.pexels.com/photos/8405873/pexels-photo-8405873.jpeg?auto=compress&cs=tinysrgb&w=1600&lazy=load",
    username: "Elva McDonald",
    email: "elva@gmail.com",
    amount: "3.668",
  },
  {
    id: 2,
    img: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1600",
    username: "Linnie Nelson",
    email: "linnie@gmail.com",
    amount: "3.256",
  },
  {
    id: 3,
    img: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=1600",
    username: "Brent Reeves",
    email: "brent@gmail.com",
    amount: "2.998",
  },
  {
    id: 4,
    img: "https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=1600",
    username: "Adeline Watson",
    email: "adeline@gmail.com",
    amount: "2.512",
  },
  {
    id: 5,
    img: "https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=1600",
    username: "Juan Harrington",
    email: "juan@gmail.com",
    amount: "2.134",
  },
  {
    id: 6,
    img: "https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=1600",
    username: "Augusta McGee",
    email: "augusta@gmail.com",
    amount: "1.932",
  },
  {
    id: 7,
    img: "https://images.pexels.com/photos/874158/pexels-photo-874158.jpeg?auto=compress&cs=tinysrgb&w=1600",
    username: "Angel Thomas",
    email: "angel@gmail.com",
    amount: "1.560",
  },
];

export const chartBoxUser = {
  color: "#8884d8",
  icon: "/userIcon.svg",
  title: "Total Users",
  number: "11.238",
  dataKey: "users",
  percentage: 45,
  chartData: [
    { name: "Sun", users: 400 },
    { name: "Mon", users: 600 },
    { name: "Tue", users: 500 },
    { name: "Wed", users: 700 },
    { name: "Thu", users: 400 },
    { name: "Fri", users: 500 },
    { name: "Sat", users: 450 },
  ],
};

export const chartBoxProduct = {
  color: "skyblue",
  icon: "/productIcon.svg",
  title: "Total Products",
  number: "238",
  dataKey: "products",
  percentage: 21,
  chartData: [
    { name: "Sun", products: 400 },
    { name: "Mon", products: 600 },
    { name: "Tue", products: 500 },
    { name: "Wed", products: 700 },
    { name: "Thu", products: 400 },
    { name: "Fri", products: 500 },
    { name: "Sat", products: 450 },
  ],
};

export const chartBoxRevenue = {
  color: "teal",
  icon: "/revenueIcon.svg",
  title: "Total Revenue",
  number: "$56.432",
  dataKey: "revenue",
  percentage: -12,
  chartData: [
    { name: "Sun", revenue: 400 },
    { name: "Mon", revenue: 600 },
    { name: "Tue", revenue: 500 },
    { name: "Wed", revenue: 700 },
    { name: "Thu", revenue: 400 },
    { name: "Fri", revenue: 500 },
    { name: "Sat", revenue: 450 },
  ],
};

export const chartBoxConversion = {
  color: "gold",
  icon: "/conversionIcon.svg",
  title: "Total Ratio",
  number: "2.6",
  dataKey: "ratio",
  percentage: 12,
  chartData: [
    { name: "Sun", ratio: 400 },
    { name: "Mon", ratio: 600 },
    { name: "Tue", ratio: 500 },
    { name: "Wed", ratio: 700 },
    { name: "Thu", ratio: 400 },
    { name: "Fri", ratio: 500 },
    { name: "Sat", ratio: 450 },
  ],
};

export const barChartBoxRevenue = {
  title: "Profit Earned",
  color: "#8884d8",
  dataKey: "profit",
  chartData: [
    {
      name: "Sun",
      profit: 4000,
    },
    {
      name: "Mon",
      profit: 3000,
    },
    {
      name: "Tue",
      profit: 2000,
    },
    {
      name: "Wed",
      profit: 2780,
    },
    {
      name: "Thu",
      profit: 1890,
    },
    {
      name: "Fri",
      profit: 2390,
    },
    {
      name: "Sat",
      profit: 3490,
    },
  ],
};

export const barChartBoxVisit = {
  title: "Total Visit",
  color: "#FF8042",
  dataKey: "visit",
  chartData: [
    {
      name: "Sun",
      visit: 4000,
    },
    {
      name: "Mon",
      visit: 3000,
    },
    {
      name: "Tue",
      visit: 2000,
    },
    {
      name: "Wed",
      visit: 2780,
    },
    {
      name: "Thu",
      visit: 1890,
    },
    {
      name: "Fri",
      visit: 2390,
    },
    {
      name: "Sat",
      visit: 3490,
    },
  ],
};

export const bigChartData = [
  {
    name: "Sun",
    books: 4000,
    clothes: 2400,
    electronic: 2400,
  },
  {
    name: "Mon",
    books: 3000,
    clothes: 1398,
    electronic: 2210,
  },
  {
    name: "Tue",
    books: 2000,
    clothes: 9800,
    electronic: 2290,
  },
  {
    name: "Wed",
    books: 2780,
    clothes: 3908,
    electronic: 2000,
  },
  {
    name: "Thu",
    books: 1890,
    clothes: 4800,
    electronic: 2181,
  },
  {
    name: "Fri",
    books: 2390,
    clothes: 3800,
    electronic: 2500,
  },
  {
    name: "Sat",
    books: 3490,
    clothes: 4300,
    electronic: 2100,
  },
];

export const userRows = [
  {
    id: 1,
    img: "https://images.pexels.com/photos/8405873/pexels-photo-8405873.jpeg?auto=compress&cs=tinysrgb&w=1600&lazy=load",
    lastName: "Hubbard",
    firstName: "Eula",
    email: "kewez@@gmail.com",
    phone: "123 456 789",
    createdAt: "01.02.2023",
    verified: true,
  },
  {
    id: 2,
    img: "https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=1600",
    lastName: "Manning",
    firstName: "Stella",
    email: "comhuhmit@gmail.com",
    phone: "123 456 789",
    createdAt: "01.02.2023",
    verified: true,
  },
  {
    id: 3,
    img: "https://images.pexels.com/photos/1587009/pexels-photo-1587009.jpeg?auto=compress&cs=tinysrgb&w=1600",
    lastName: "Greer",
    firstName: "Mary",
    email: "ujudokon@hottmail.com",
    phone: "123 456 789",
    createdAt: "01.02.2023",
    verified: true,
  },
  {
    id: 4,
    img: "https://images.pexels.com/photos/871495/pexels-photo-871495.jpeg?auto=compress&cs=tinysrgb&w=1600",
    lastName: "Williamson",
    firstName: "Mildred",
    email: "tinhavabe@gmail.com",
    phone: "123 456 789",
    createdAt: "01.02.2023",
    verified: true,
  },
  {
    id: 5,
    img: "https://images.pexels.com/photos/1758144/pexels-photo-1758144.jpeg?auto=compress&cs=tinysrgb&w=1600",
    lastName: "Gross",
    firstName: "Jose",
    email: "gobtagbes@yahoo.com",
    phone: "123 456 789",
    createdAt: "01.02.2023",
  },
  {
    id: 6,
    img: "https://images.pexels.com/photos/769745/pexels-photo-769745.jpeg?auto=compress&cs=tinysrgb&w=1600",
    lastName: "Sharp",
    firstName: "Jeremy",
    email: "vulca.eder@mail.com",
    phone: "123 456 789",
    createdAt: "01.02.2023",
    verified: true,
  },
  {
    id: 7,
    img: "https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=1600",
    lastName: "Lowe",
    firstName: "Christina",
    email: "reso.bilic@gmail.com",
    phone: "123 456 789",
    createdAt: "01.02.2023",
  },
  {
    id: 8,
    img: "https://images.pexels.com/photos/428364/pexels-photo-428364.jpeg?auto=compress&cs=tinysrgb&w=1600",
    lastName: "Dean",
    firstName: "Garrett",
    email: "codaic@mail.com",
    phone: "123 456 789",
    createdAt: "01.02.2023",
    verified: true,
  },
  {
    id: 9,
    img: "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=1600",
    lastName: "Parsons",
    firstName: "Leah",
    email: "uzozor@gmail.com",
    phone: "123 456 789",
    createdAt: "01.02.2023",
  },
  {
    id: 10,
    img: "https://images.pexels.com/photos/775358/pexels-photo-775358.jpeg?auto=compress&cs=tinysrgb&w=1600",
    lastName: "Reid",
    firstName: "Elnora",
    email: "tuhkabapu@gmail.com",
    phone: "123 456 789",
    createdAt: "01.02.2023",
    verified: true,
  },
  {
    id: 11,
    img: "https://images.pexels.com/photos/762020/pexels-photo-762020.jpeg?auto=compress&cs=tinysrgb&w=1600",
    lastName: "Dunn",
    firstName: "Gertrude",
    email: "gibo@gmail.com",
    phone: "123 456 789",
    createdAt: "01.02.2023",
    verified: true,
  },
  {
    id: 12,
    img: "https://images.pexels.com/photos/774095/pexels-photo-774095.jpeg?auto=compress&cs=tinysrgb&w=1600",
    lastName: "Williams",
    firstName: "Mark",
    email: "tic.harvey@hotmail.com",
    phone: "123 456 789",
    createdAt: "01.02.2023",
  },
  {
    id: 13,
    img: "https://images.pexels.com/photos/761977/pexels-photo-761977.jpeg?auto=compress&cs=tinysrgb&w=1600",
    lastName: "Cruz",
    firstName: "Charlotte",
    email: "ceuc@gmail.com",
    phone: "123 456 789",
    createdAt: "01.02.2023",
  },
  {
    id: 14,
    img: "https://images.pexels.com/photos/927022/pexels-photo-927022.jpeg?auto=compress&cs=tinysrgb&w=1600",
    lastName: "Harper",
    firstName: "Sara",
    email: "bafuv@hotmail.com",
    phone: "123 456 789",
    createdAt: "01.02.2023",
  },
  {
    id: 15,
    img: "https://images.pexels.com/photos/8405873/pexels-photo-8405873.jpeg?auto=compress&cs=tinysrgb&w=1600&lazy=load",
    lastName: "Griffin",
    firstName: "Eric",
    email: "ubi@gmail.com",
    phone: "123 456 789",
    createdAt: "01.02.2023",
  },
];

export const MealsData = [
    {
        "id": 1,
        "day": "Monday",
        "type": "Low-Carb",
        "details": [
            {
                "meal_num": 1,
                "meal_type": "---",
                "meal_name": "Pre-Workout",
                "recipe": [
                    "1/2 tbsp Coffee",
                    "200 ml hot water"
                ]
            },
            {
                "meal_num": 2,
                "meal_type": "Breakfast",
                "meal_name": "Peanut Butter Banana Smoothie",
                "recipe": [
                    "1 Tbsp peanut butter",
                    "1 Banana",
                    "240 ml milk"
                ]
            },
        
            {
                "meal_num": 3,
                "meal_type": "Lunch",
                "meal_name": "Paneer and Vegies",
                "recipe": [
                    "100 gm Paneer",
                    "1/2 cup Rajma",
                    "1/2 cup Green Beans",
                    "1/2 cup Bell Peppers",
                    "1/2 cup Cauliflower",
                    "1 Tomato",
                    "1 Tbsp Yogurt + Ketchup Mix"
                ]
            },
            {
                "meal_num": 4,
                "meal_type": "Snack",
                "meal_name": "Apple",
                "recipe": []
            },
            {
                "meal_num": 5,
                "meal_type": "Dinner",
                "meal_name": "Roti Beans Wrap",
                "recipe": [
                    "2 Roti",
                    "120 gm Paneer",
                    "1/2 cup Rajma",
                    "1/2 cup Green Beans",
                    "1/2 cup Cauliflower",
                    "1 Boiled Potato",
                    "1 Tomato",
                    "1 Tbsp Yogurt + Ketchup Mix"
                ]
            },
            
        ]
    },
    {
        "id": 2,
        "day": "Tuesday",
        "type": "Low-Carb",
        "details": [
            {
                "meal_num": 1,
                "meal_type": "---",
                "meal_name": "Pre-Workout",
                "recipe": [
                    "1/2 tbsp Coffee",
                    "200 ml hot water"
                ]
            },
            {
                "meal_num": 2,
                "meal_type": "Breakfast",
                "meal_name": "Peanut Butter Banana Smoothie",
                "recipe": [
                    "1 Tbsp peanut butter",
                    "1 Banana",
                    "240 ml milk"
                ]
            },
        
            {
                "meal_num": 3,
                "meal_type": "Lunch",
                "meal_name": "Paneer and Vegies",
                "recipe": [
                    "100 gm Paneer",
                    "1/2 cup Rajma",
                    "1/2 cup Green Beans",
                    "1/2 cup Bell Peppers",
                    "1/2 cup Cauliflower",
                    "1 Tomato",
                    "1 Tbsp Yogurt + Ketchup Mix"
                ]
            },
            {
                "meal_num": 4,
                "meal_type": "Snack",
                "meal_name": "Apple",
                "recipe": []
            },
            {
                "meal_num": 5,
                "meal_type": "Dinner",
                "meal_name": "Roti Beans Wrap",
                "recipe": [
                    "2 Roti",
                    "120 gm Paneer",
                    "1/2 cup Rajma",
                    "1/2 cup Green Beans",
                    "1/2 cup Cauliflower",
                    "1 Boiled Potato",
                    "1 Tomato",
                    "1 Tbsp Yogurt + Ketchup Mix"
                ]
            },
            
        ]
    },
    {
        "id": 3,
        "day": "Wednesday",
        "type": "Low-Carb",
        "details": [
            {
                "meal_num": 1,
                "meal_type": "---",
                "meal_name": "Pre-Workout",
                "recipe": [
                    "1/2 tbsp Coffee",
                    "200 ml hot water"
                ]
            },
            {
                "meal_num": 2,
                "meal_type": "Breakfast",
                "meal_name": "Peanut Butter Banana Smoothie",
                "recipe": [
                    "1 Tbsp peanut butter",
                    "1 Banana",
                    "240 ml milk"
                ]
            },
        
            {
                "meal_num": 3,
                "meal_type": "Lunch",
                "meal_name": "Paneer and Vegies",
                "recipe": [
                    "100 gm Paneer",
                    "1/2 cup Rajma",
                    "1/2 cup Green Beans",
                    "1/2 cup Bell Peppers",
                    "1/2 cup Cauliflower",
                    "1 Tomato",
                    "1 Tbsp Yogurt + Ketchup Mix"
                ]
            },
            {
                "meal_num": 4,
                "meal_type": "Snack",
                "meal_name": "Apple",
                "recipe": []
            },
            {
                "meal_num": 5,
                "meal_type": "Dinner",
                "meal_name": "Roti Beans Wrap",
                "recipe": [
                    "2 Roti",
                    "120 gm Paneer",
                    "1/2 cup Rajma",
                    "1/2 cup Green Beans",
                    "1/2 cup Cauliflower",
                    "1 Boiled Potato",
                    "1 Tomato",
                    "1 Tbsp Yogurt + Ketchup Mix"
                ]
            },
            
        ]
    },
    {
        "id": 4,
        "day": "Thursday",
        "type": "High-Carb",
        "details": [
            {
                "meal_num": 1,
                "meal_type": "---",
                "meal_name": "Pre-Workout",
                "recipe": [
                    "1/2 tbsp Coffee",
                    "200 ml hot water"
                ]
            },
            {
                "meal_num": 2,
                "meal_type": "Breakfast",
                "meal_name": "Oats and Coffee",
                "recipe": [
                  "1 cup black coffee",
                  "1 bowl oats"
                ]
            },
        
            {
                "meal_num": 3,
                "meal_type": "Lunch",
                "meal_name": "Paneer and Rice",
                "recipe": [
                    "100 gm Paneer",
                    "1/2 cup Rajma",
                    "1 cup Rice",
                    "1/2 cup Green Beans",
                    "1/2 cup Bell Peppers",
                    "1/2 cup Cauliflower",
                    "1 Tomato"
                ]
            },
            {
                "meal_num": 4,
                "meal_type": "Snack",
                "meal_name": "Banana Bread Toast",
                "recipe": [
                    "2 Wheat Bread",
                    "1 tbsp Peanut Butter",
                    "1/2 Banana"
                ]
            },
            {
                "meal_num": 5,
                "meal_type": "Dinner",
                "meal_name": "Paneer Bhurji and Roti",
                "recipe": [
                    "1 Roti",
                    "150 gm Paneer",
                    "1 Tomato",
                    "1 cup Yoghurt"
                ]
            }
        ]
    },
    {
        "id": 5,
        "day": "Friday",
        "type": "High-Carb",
        "details": [
            {
                "meal_num": 1,
                "meal_type": "---",
                "meal_name": "Pre-Workout",
                "recipe": [
                    "1/2 tbsp Coffee",
                    "200 ml hot water"
                ]
            },
            {
                "meal_num": 2,
                "meal_type": "Breakfast",
                "meal_name": "Oats and Coffee",
                "recipe": [
                  "1 cup black coffee",
                  "1 bowl oats"
                ]
            },
        
            {
                "meal_num": 3,
                "meal_type": "Lunch",
                "meal_name": "Paneer and Rice",
                "recipe": [
                    "100 gm Paneer",
                    "1/2 cup Rajma",
                    "1 cup Rice",
                    "1/2 cup Green Beans",
                    "1/2 cup Bell Peppers",
                    "1/2 cup Cauliflower",
                    "1 Tomato"
                ]
            },
            {
                "meal_num": 4,
                "meal_type": "Snack",
                "meal_name": "Banana Bread Toast",
                "recipe": [
                    "2 Wheat Bread",
                    "1 tbsp Peanut Butter",
                    "1/2 Banana"
                ]
            },
            {
                "meal_num": 5,
                "meal_type": "Dinner",
                "meal_name": "Paneer Bhurji and Roti",
                "recipe": [
                    "1 Roti",
                    "150 gm Paneer",
                    "1 Tomato",
                    "1 cup Yoghurt"
                ]
            }
        ]
    },
    {
        "id": 6,
        "day": "Saturday",
        "type": "High-Carb",
        "details": [
            {
                "meal_num": 1,
                "meal_type": "---",
                "meal_name": "Pre-Workout",
                "recipe": [
                    "1/2 tbsp Coffee",
                    "200 ml hot water"
                ]
            },
            {
                "meal_num": 2,
                "meal_type": "Breakfast",
                "meal_name": "Oats and Coffee",
                "recipe": [
                  "1 cup black coffee",
                  "1 bowl oats"
                ]
            },
        
            {
                "meal_num": 3,
                "meal_type": "Lunch",
                "meal_name": "Paneer and Rice",
                "recipe": [
                    "100 gm Paneer",
                    "1/2 cup Rajma",
                    "1 cup Rice",
                    "1/2 cup Green Beans",
                    "1/2 cup Bell Peppers",
                    "1/2 cup Cauliflower",
                    "1 Tomato"
                ]
            },
            {
                "meal_num": 4,
                "meal_type": "Snack",
                "meal_name": "Banana Bread Toast",
                "recipe": [
                    "2 Wheat Bread",
                    "1 tbsp Peanut Butter",
                    "1/2 Banana"
                ]
            },
            {
                "meal_num": 5,
                "meal_type": "Dinner",
                "meal_name": "Paneer Bhurji and Roti",
                "recipe": [
                    "1 Roti",
                    "150 gm Paneer",
                    "1 Tomato",
                    "1 cup Yoghurt"
                ]
            }
        ]
    }
]