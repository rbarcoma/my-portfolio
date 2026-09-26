<?php

namespace Tests\Feature;

use Tests\TestCase;

class CvDownloadTest extends TestCase
{
    public function test_download_returns_404_while_no_cv_is_uploaded(): void
    {
        $this->get(route('cv'))->assertNotFound();
    }

    public function test_download_streams_the_pdf_with_a_filename(): void
    {
        $path = public_path(config('portfolio.cv.path'));
        $directory = dirname($path);

        if (! is_dir($directory)) {
            mkdir($directory, 0755, true);
        }

        file_put_contents($path, '%PDF-1.4 test');

        try {
            $this->get(route('cv'))
                ->assertOk()
                ->assertHeader('content-type', 'application/pdf')
                ->assertDownload(config('portfolio.cv.filename'));
        } finally {
            @unlink($path);
        }
    }
}
