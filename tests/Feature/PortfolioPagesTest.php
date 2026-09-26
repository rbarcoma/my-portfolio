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

    public function test_home_page_renders_featured_projects(): void
    {
        $this->get(route('home'))
            ->assertOk()
            ->assertInertia(fn (AssertableInertia $page) => $page
                ->component('Home')
                ->has('hero.headline')
                ->has('stats')
                ->has('about.values')
                ->has('featuredProjects', count(config('projects.projects')))
                ->has('github.available')
            );
    }

    public function test_about_page_renders_timeline(): void
    {
        $this->get(route('about'))
            ->assertOk()
            ->assertInertia(fn (AssertableInertia $page) => $page
                ->component('About')
                ->has('about.bio')
                ->has('timeline')
                ->has('cv.path')
            );
    }

    public function test_skills_page_renders_all_groups(): void
    {
        $this->get(route('skills'))
            ->assertOk()
            ->assertInertia(fn (AssertableInertia $page) => $page
                ->component('Skills')
                ->has('groups', count(config('portfolio.skill_groups')))
            );
    }

    public function test_experience_page_renders_timeline(): void
    {
        $this->get(route('experience'))
            ->assertOk()
            ->assertInertia(fn (AssertableInertia $page) => $page
                ->component('Experience')
                ->has('timeline')
            );
    }

    public function test_projects_index_lists_every_configured_project(): void
    {
        $this->get(route('projects.index'))
            ->assertOk()
            ->assertInertia(fn (AssertableInertia $page) => $page
                ->component('Projects/Index')
                ->has('projects', count(config('projects.projects')))
                ->has('statuses')
            );
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

    public function test_unknown_project_slug_redirects_to_the_index(): void
    {
        $this->get(route('projects.show', 'does-not-exist'))
            ->assertRedirect(route('projects.index'));
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
