<?php

use App\Http\Controllers\ContactController;
use App\Http\Controllers\CvController;
use App\Http\Controllers\GithubController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\ProjectController;
use Illuminate\Support\Facades\Route;

Route::get('/', HomeController::class)->name('home');
Route::get('/about', fn () => to_route('home')->withFragment('about'))->name('about');
Route::get('/skills', fn () => to_route('home')->withFragment('skills'))->name('skills');
Route::get('/experience', fn () => to_route('home')->withFragment('experience'))->name('experience');

Route::get('/projects', fn () => to_route('home')->withFragment('projects'))->name('projects.index');
Route::get('/projects/{slug}', [ProjectController::class, 'show'])->name('projects.show');

Route::get('/contact', fn () => to_route('home')->withFragment('contact'))->name('contact');
Route::post('/contact', [ContactController::class, 'store'])
    ->middleware('throttle:contact')
    ->name('contact.store');

Route::get('/cv', CvController::class)->name('cv');
Route::get('/github/stats', [GithubController::class, 'stats'])
    ->middleware('throttle:60,1')
    ->name('github.stats');
Route::post('/github/webhook', [GithubController::class, 'webhook'])
    ->middleware('throttle:10,1')
    ->name('github.webhook');
