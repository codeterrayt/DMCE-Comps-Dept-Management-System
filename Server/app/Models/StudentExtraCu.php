<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StudentExtraCu extends Model
{
    use HasFactory;

    protected $fillable = [
        'academic_year',
        'student_year',
        'ecc_certificate_path',
        'ecc_domain',
        'college_name',
        'ecc_level',
        'ecc_location',
        'ecc_date',
        'prize',
        'description',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }


}
