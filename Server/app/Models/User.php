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
        'middle_name',
        'last_name',
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

    // public function sendEmailVerificationNotification()
    // {
    //     $this->notify(new \App\Notifications\UserVerifyNotification(Auth::user()));  //pass the currently logged in user to the notification class
    // }

    public function fetch_internships()
    {
        return $this->hasMany(StudentInternship::class)->get();
    }

    public function studentInternship()
    {
        return $this->hasMany(StudentInternship::class);
    }

    public function fetch_achievements()
    {
        return $this->hasMany(StudentAchivements::class)->get();
    }

    public function studentAchievements()
    {
        return $this->hasMany(StudentAchivements::class);
    }

    public function fetch_extra_curr()
    {
        return $this->hasMany(StudentExtraCu::class)->get();
    }

    public function StudentExtraCurr()
    {
        return $this->hasMany(StudentExtraCu::class);
    }

    public function fetch_hackathons()
    {
        return $this->hasMany(StudentHackathons::class)->get();
    }


    public function StudentHackathons()
    {
        return $this->hasMany(StudentHackathons::class);
    }

    public function fetch_higher_studies(){
        return $this->hasMany(StudentHigherStudies::class)->get();
    }

    public function studentHigherStudies()
    {
        return $this->hasMany(StudentHigherStudies::class);
    }

    public function fetch_placements(){
        return $this->hasMany(StudentPlacements::class)->get();
    }

    public function StudentPlacements(){
        return $this->hasMany(StudentPlacements::class);
    }


    // public function professor()
    // {
    //     return $this->belongsTo(Professor::class, 'id', 'user_id');
    // }

    public function professor()
    {
        return $this->hasOne(Professor::class);
    }

}
