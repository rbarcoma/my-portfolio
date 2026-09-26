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

    'email' => env('PORTFOLIO_EMAIL', 'hello@example.com'),

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
        'values' => [
            [
                'title' => 'Ship the whole thing',
                'description' => 'Backend and frontend are one product. I take a feature from migration to the last pixel so nothing gets lost between layers.',
            ],
            [
                'title' => 'Accessible by default',
                'description' => 'Keyboard flow, focus states, contrast, and reduced-motion are part of the build, not a cleanup task before launch.',
            ],
            [
                'title' => 'Performance is a feature',
                'description' => 'Cached queries, code-split bundles, and animation that only touches transform and opacity. Fast is a requirement, not an optimization pass.',
            ],
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
            'skills' => [
                ['name' => 'HTML', 'level' => 95],
                ['name' => 'CSS', 'level' => 90],
                ['name' => 'JavaScript', 'level' => 88],
                ['name' => 'React', 'level' => 82],
                ['name' => 'Inertia.js', 'level' => 80],
                ['name' => 'Tailwind CSS', 'level' => 88],
                ['name' => 'shadcn/ui', 'level' => 75],
            ],
        ],
        [
            'id' => 'backend',
            'label' => 'Backend',
            'skills' => [
                ['name' => 'PHP', 'level' => 88],
                ['name' => 'Laravel', 'level' => 85],
                ['name' => 'Python', 'level' => 70],
                ['name' => 'SQL', 'level' => 80],
                ['name' => 'MySQL', 'level' => 78],
                ['name' => 'REST APIs', 'level' => 80],
            ],
        ],
        [
            'id' => 'tools',
            'label' => 'Tools & DevOps',
            'skills' => [
                ['name' => 'Git', 'level' => 85],
                ['name' => 'GitHub', 'level' => 85],
                ['name' => 'Docker', 'level' => 65],
                ['name' => 'NPM', 'level' => 82],
                ['name' => 'Vite', 'level' => 75],
                ['name' => 'Composer', 'level' => 82],
            ],
        ],
        [
            'id' => 'design',
            'label' => 'Design',
            'skills' => [
                ['name' => 'Figma', 'level' => 70],
                ['name' => 'Canva', 'level' => 80],
                ['name' => 'Design systems', 'level' => 68],
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
        ['label' => 'GitHub', 'url' => 'https://github.com/renantebarcoma', 'icon' => 'github'],
        ['label' => 'LinkedIn', 'url' => 'https://www.linkedin.com/in/renantebarcoma', 'icon' => 'linkedin'],
        ['label' => 'Email', 'url' => 'mailto:hello@example.com', 'icon' => 'mail'],
    ],

    'github_username' => env('GITHUB_USERNAME', 'renantebarcoma'),

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
