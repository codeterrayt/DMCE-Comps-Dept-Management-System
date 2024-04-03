<?php

namespace App\Http\Controllers;

use App\Models\StudentInternship;
use App\Models\User;
use Illuminate\Http\Request;

class StudentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = User::query();

        $query->where('role', 'student');

        // Apply filter by name and email combined
        if ($request->has('search')) {
            $searchTerm = '%' . $request->input('search') . '%';
            $query->where(function ($query) use ($searchTerm) {
                $query->where('name', 'like', $searchTerm)
                    ->orWhere('email', 'like', $searchTerm);
            });
        }

        // Apply filter by roll number
        if ($request->has('roll_no')) {
            $direction = $request->input('roll_no') === 'desc' ? 'desc' : 'asc';
            $query->orderBy('roll_no', $direction);
        }

        // Apply filter by admitted year
        if ($request->has('admitted_year') && is_numeric($request->input('admitted_year'))) {
            $query->where('admitted_year', $request->input('admitted_year'));
        }

        // Apply filter by division
        if ($request->has('div')) {
            $query->where('div', $request->input('div'));
        }

        if ($request->has('higher_studies')) {
            if ($request->input('higher_studies') == 1) {
                $query->whereHas('studentHigherStudies');
            } else {
                $query->whereDoesntHave('studentHigherStudies');
            }
        }

        if ($request->has('internship')) {
            if ($request->input('internship') == 1) {
                $query->whereHas('studentInternship');
            } else {
                $query->whereDoesntHave('studentInternship');
            }
        }

        if ($request->has('achievements')) {
            if ($request->input('achievements') == 1) {
                $query->whereHas('studentAchievements');
            } else {
                $query->whereDoesntHave('studentAchievements');
            }
        }

        if ($request->has('ecc')) {
            if ($request->input('ecc') == 1) {
                $query->whereHas('StudentExtraCurr');
            } else {
                $query->whereDoesntHave('StudentExtraCurr');
            }
        }

        if ($request->has('hackathons')) {
            if ($request->input('hackathons') == 1) {
                $query->whereHas('StudentHackathons');
            } else {
                $query->whereDoesntHave('StudentHackathons');
            }
        }

        if ($request->has('placements')) {
            if ($request->input('placements') == 1) {
                $query->whereHas('StudentPlacements');
            } else {
                $query->whereDoesntHave('StudentPlacements');
            }
        }

        if ($request->has('placement_type')) {
            $placementsValue = $request->input('placement_type');
            $query->whereHas('StudentPlacements', function ($query) use ($placementsValue) {
                $query->where('campus_or_off_campus', $placementsValue);
            });
        }



        // Get page number from request, default to 1
        $page = $request->input('page', 1);

        // Get items per page from request, default to 10
        $perPage = $request->input('per_page', 10);

        // Paginate the query
        $users = $query->paginate($perPage, ['*'], 'page', $page);

        // Execute the query and return results
        $users = $query->get();

        // Return the filtered users as JSON response
        return response()->json($users);
    }

    public function fetch_internship_by_student_id(Request $request){
        // Validate the incoming request data
        $request->validate([
            'student_id' => 'required|exists:users,id',
        ]);

        // Get the student ID from the request
        $studentId = $request->input('student_id');

        // Query the StudentInternship model to fetch internships by student ID
        $internships = User::where("id",$studentId)->with("studentInternship")->get();

        // Return the fetched internships as a JSON response
        return response()->json(['internships' => $internships]);
    }

    public function fetch_ecc_by_student_id(Request $request){
          // Validate the incoming request data
          $request->validate([
            'student_id' => 'required|exists:users,id',
        ]);

        // Get the student ID from the request
        $studentId = $request->input('student_id');

        // Query the StudentInternship model to fetch internships by student ID
        $ecc = User::where("id",$studentId)->with("StudentExtraCurr")->get();

        // Return the fetched internships as a JSON response
        return response()->json(['ecc' => $ecc]);

    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
