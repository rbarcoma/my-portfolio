<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class CvController extends Controller
{
    public function __invoke(Request $request): BinaryFileResponse
    {
        $cv = config('portfolio.cv');
        $path = public_path(ltrim($cv['path'], '/'));

        abort_unless(is_file($path), 404, 'CV not uploaded yet.');

        return response()->download($path, $request->string('filename', $cv['filename'])->toString(), [
            'Content-Type' => 'application/pdf',
        ]);
    }
}
