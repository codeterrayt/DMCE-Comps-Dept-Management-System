<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Auth;

class User extends Authenticatable
// class User extends Authenticatable  implements MustVerifyEmail
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'roll_no',
        'student_id',
        'admitted_year',
        'div',
        'role'
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    public function sendEmailVerificationNotification()
    {
        $this->notify(new \App\Notifications\UserVerifyNotification(Auth::user()));  //pass the currently logged in user to the notification class
    }

    public function fetch_internships()
    {
        return $this->hasMany(StudentInternship::class)->get();
    }

    public function fetch_achievements()
    {
        return $this->hasMany(StudentAchivements::class)->get();
    }

    public function fetch_extra_curr()
    {
        return $this->hasMany(StudentExtraCu::class)->get();
    }

}
