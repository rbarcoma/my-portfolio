<?php

namespace Tests\Feature;

use Illuminate\Support\Facades\Http;
use Inertia\Testing\AssertableInertia;
use Tests\TestCase;

class PortfolioPagesTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        // The pages render GitHub data; keep the suite offline and deterministic.
        Http::preventStrayRequests();
        Http::fake([
            'api.github.com/*' => Http::response(null, 503),
            '*' => Http::response(null, 503),
        ]);
    }

    public function test_home_page_renders_the_complete_single_page_portfolio(): void
    {
        $this->get(route('home'))
            ->assertOk()
            ->assertInertia(fn (AssertableInertia $page) => $page
                ->component('Home')
                ->has('hero.headline')
                ->has('stats')
                ->has('about.bio')
                ->has('groups', 5)
                ->where('groups.0.label', 'Frontend')
                ->where('groups.0.skills.3.name', 'TypeScript')
                ->where('groups.1.skills.4.name', 'REST API')
                ->where('groups.2.label', 'Database')
                ->where('groups.2.skills.0.name', 'MySQL')
                ->where('groups.3.label', 'DevOps and Tools')
                ->where('groups.4.skills.0.name', 'Canva')
                ->has('projects', count(config('projects.projects')))
                ->has('timeline')
                ->has('contact.headline')
                ->has('github.available')
            );
    }

    public function test_legacy_section_urls_redirect_to_their_home_anchors(): void
    {
        $sections = [
            route('about') => 'about',
            route('skills') => 'skills',
            route('projects.index') => 'projects',
            route('experience') => 'experience',
        ];

        foreach ($sections as $url => $section) {
            $this->get($url)->assertRedirect(route('home').'#'.$section);
        }
    }

    public function test_project_page_renders_the_requested_case_study(): void
    {
        $project = config('projects.projects')[0];

        $this->get(route('projects.show', $project['slug']))
            ->assertOk()
            ->assertInertia(fn (AssertableInertia $page) => $page
                ->component('Projects/Show')
                ->where('project.slug', $project['slug'])
                ->has('project.features')
                ->has('project.challenges')
                ->has('navigation')
            );
    }

    public function test_project_navigation_points_at_the_neighbouring_projects(): void
    {
        $projects = config('projects.projects');

        $this->get(route('projects.show', $projects[1]['slug']))
            ->assertOk()
            ->assertInertia(fn (AssertableInertia $page) => $page
                ->where('navigation.previous.slug', $projects[0]['slug'])
                ->where('navigation.next.slug', $projects[2]['slug'])
            );
    }

    public function test_unknown_project_slug_redirects_to_the_home_projects_section(): void
    {
        $this->get(route('projects.show', 'does-not-exist'))
            ->assertRedirect(route('home').'#projects');
    }

    public function test_shared_props_are_available_on_every_page(): void
    {
        $this->get(route('home'))
            ->assertOk()
            ->assertInertia(fn (AssertableInertia $page) => $page
                ->where('portfolio.name', config('portfolio.name'))
                ->has('portfolio.timezone')
                ->has('socials')
                ->has('ziggy.config.routes')
            );
    }
}
