<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Identity
    |--------------------------------------------------------------------------
    */

    'name' => env('PORTFOLIO_NAME', 'Renante Barcoma'),

    'role' => 'Full-Stack Developer',

    'location' => env('PORTFOLIO_LOCATION', 'Philippines'),

    'timezone' => env('PORTFOLIO_TIMEZONE', 'Asia/Manila'),

    'email' => env('PORTFOLIO_EMAIL', 'renantebarcoma1@gmail.com'),

    'availability' => 'Open to full-time roles, freelance projects, and internships.',

    'meta_description' => 'Renante Barcoma is a full-stack developer building fast, accessible web applications with Laravel, React, Inertia.js, and Tailwind CSS.',

    /*
    |--------------------------------------------------------------------------
    | Hero copy
    |--------------------------------------------------------------------------
    */

    'hero' => [
        'eyebrow' => "HELLO, I'M RENANTE",
        'headline' => 'FULL-STACK DEVELOPER',
        'rotating' => [
            'Laravel applications',
            'React interfaces',
            'REST APIs',
            'dashboards that scale',
        ],
        'subline' => 'I design and build end-to-end web products — from relational schemas and API contracts to pixel-perfect interfaces that feel instant.',
    ],

    /*
    |--------------------------------------------------------------------------
    | Stats band
    |--------------------------------------------------------------------------
    */

    'stats' => [
        ['label' => 'Years coding', 'value' => 3, 'suffix' => '+'],
        ['label' => 'Projects shipped', 'value' => 3, 'suffix' => ''],
        ['label' => 'Technologies', 'value' => 20, 'suffix' => '+'],
        ['label' => 'Commits pushed', 'value' => null, 'suffix' => '', 'source' => 'github'],
    ],

    /*
    |--------------------------------------------------------------------------
    | About
    |--------------------------------------------------------------------------
    */

    'about' => [
        'headline' => 'I build for the web because it scales everywhere.',
        'lead' => "I'm Renante Barcoma, a full-stack developer based in the Philippines, currently completing a BS in Information Technology at Our Lady of Fatima University. I like problems that need both an API and an interface — the kind of work where the database design and the 60fps animation matter equally.",
        'bio' => [
            'My day-to-day is Laravel and React: migrations and models on one side, components and interactions on the other. I care about the boring parts too — validation, accessibility, error states, and the code someone else will read in six months.',
            'Outside of coursework I take on freelance builds, sharpen my data/AI work with forecasting projects, and write about what I learn so the next person saves an afternoon.',
        ],
        'photo' => '/images/portrait.svg',
        'quick_facts' => [
            ['label' => 'Name', 'value' => 'Renante Barcoma'],
            ['label' => 'Role', 'value' => 'Full-Stack Developer'],
            ['label' => 'Location', 'value' => 'Philippines (UTC+8)'],
            ['label' => 'Languages', 'value' => 'English, Filipino'],
            ['label' => 'Education', 'value' => 'BS Information Technology — OLFU (2023–2027)'],
            ['label' => 'Availability', 'value' => 'Open to work'],
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Skills
    |--------------------------------------------------------------------------
    */

    'skill_groups' => [
        [
            'id' => 'frontend',
            'label' => 'Frontend',
            'description' => 'Responsive interfaces and component systems that feel as good as they perform.',
            'skills' => [
                ['name' => 'HTML', 'icon' => 'html5', 'color' => 'E34F26'],
                ['name' => 'CSS', 'icon' => 'css', 'color' => '1572B6'],
                ['name' => 'JavaScript', 'icon' => 'javascript', 'color' => 'F7DF1E'],
                ['name' => 'TypeScript', 'icon' => 'typescript', 'color' => '3178C6'],
                ['name' => 'React', 'icon' => 'react', 'color' => '61DAFB'],
                ['name' => 'Tailwind CSS', 'icon' => 'tailwindcss', 'color' => '06B6D4'],
                ['name' => 'Inertia.js', 'icon' => 'inertia', 'color' => '9553E9'],
                ['name' => 'shadcn/ui', 'icon' => 'shadcnui', 'color' => '111827'],
            ],
        ],
        [
            'id' => 'backend',
            'label' => 'Backend',
            'description' => 'Application logic, APIs, and authentication that scale with the product.',
            'skills' => [
                ['name' => 'PHP', 'icon' => 'php', 'color' => '777BB4'],
                ['name' => 'Laravel', 'icon' => 'laravel', 'color' => 'FF2D20'],
                ['name' => 'Python', 'icon' => 'python', 'color' => '3776AB'],
                ['name' => 'SQL', 'icon' => 'database', 'color' => '4479A1'],
                ['name' => 'REST API', 'icon' => 'network', 'color' => '22D3EE'],
            ],
        ],
        [
            'id' => 'database',
            'label' => 'Database',
            'description' => 'Structured data models and queries designed for reliable, useful software.',
            'skills' => [
                ['name' => 'MySQL', 'icon' => 'mysql', 'color' => '4479A1'],
            ],
        ],
        [
            'id' => 'tools',
            'label' => 'DevOps and Tools',
            'description' => 'Versioning, local tooling, and delivery workflows that keep projects moving.',
            'skills' => [
                ['name' => 'Git', 'icon' => 'git', 'color' => 'F05032'],
                ['name' => 'GitHub', 'icon' => 'github', 'color' => '111827'],
                ['name' => 'Docker', 'icon' => 'docker', 'color' => '2496ED'],
                ['name' => 'Vite', 'icon' => 'vite', 'color' => '646CFF'],
                ['name' => 'npm', 'icon' => 'npm', 'color' => 'CB3837'],
                ['name' => 'Composer', 'icon' => 'composer', 'color' => '885630'],
            ],
        ],
        [
            'id' => 'design',
            'label' => 'Design',
            'description' => 'Visual systems and collaboration tools that turn ideas into clear interfaces.',
            'skills' => [
                ['name' => 'Canva', 'icon' => 'canva', 'color' => '00C4CC'],
                ['name' => 'Figma', 'icon' => 'figma', 'color' => 'F24E1E'],
            ],
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Experience timeline
    |--------------------------------------------------------------------------
    */

    'timeline' => [
        [
            'period' => '2023 — 2027',
            'title' => 'BS Information Technology',
            'org' => 'Our Lady of Fatima University',
            'location' => 'Valenzuela, Philippines',
            'description' => 'Undergraduate program covering systems analysis, database design, web systems, data structures, and software engineering. Currently building capstone-grade full-stack projects on Laravel and React.',
            'points' => [
                'Coursework: Web Systems, Database Systems, Systems Analysis & Design, Data Structures',
                'Built three portfolio-scale full-stack projects, including a Laravel booking engine and a DSS forecasting tool',
                'Active in student orgs and technical workshops (add specifics here)',
            ],
            'current' => true,
        ],
        [
            'period' => '2024 — present',
            'title' => 'Freelance / Project Work',
            'org' => 'Self-employed',
            'location' => 'Remote',
            'description' => 'Client work and personal builds: booking systems, dashboards, and data-driven tools delivered end to end.',
            'points' => [
                'Q8 Private Booking Resort — full-stack reservation system (Laravel + MySQL)',
                'Energy Consumption Forecasting with Decision Support System (Python + DSS)',
            ],
            'current' => true,
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Contact
    |--------------------------------------------------------------------------
    */

    'contact' => [
        'headline' => "LET'S TALK",
        'lead' => 'Have a role, a project, or a stubborn bug? Send a note and I will reply within a day or two.',
    ],

    /*
    |--------------------------------------------------------------------------
    | Social links & CV
    |--------------------------------------------------------------------------
    */

    'socials' => [
        ['label' => 'GitHub', 'url' => 'https://github.com/rbarcoma', 'icon' => 'github'],
        [
            'label' => 'LinkedIn',
            'url' => 'https://www.linkedin.com/in/renante-barcoma-a70a5a438/',
            'icon' => 'linkedin',
        ],
        ['label' => 'Email', 'url' => 'mailto:renantebarcoma1@gmail.com', 'icon' => 'mail'],
    ],

    'github_username' => env('GITHUB_USERNAME', 'rbarcoma'),

    'cv' => [
        'label' => 'Download CV',
        'path' => '/cv/renante-barcoma-cv.pdf',
        'filename' => 'Renante-Barcoma-CV.pdf',
    ],

    /*
    |--------------------------------------------------------------------------
    | SEO
    |--------------------------------------------------------------------------
    */

    'meta' => [
        'og_image' => '/images/og/og-default.png',
    ],

];
