<?php

namespace App\Http\Controllers;

use App\Models\Subjects;
use Illuminate\Http\Request;

class SubjectController extends Controller
{
        /**
     * Fetch all subjects.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $subjects = Subjects::all();
        return response()->json($subjects);
    }

    /**
     * Store a newly created subject in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $request->validate([
            'subject_name' => 'required|string|max:255|unique:subjects,subject_name',
            'subject_short' => 'required|string|max:255|unique:subjects,subject_short',
            'subject_sem' => 'required|integer',
        ]);

        $subject = new Subjects();
        $subject->subject_name = $request->subject_name;
        $subject->subject_short = $request->subject_short;
        $subject->subject_sem = $request->subject_sem;
        $subject->save();

        return response()->json($subject, 201);
    }

    /**
     * Display the specified subject.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $subject = Subjects::find($id);

        if (!$subject) {
            return response()->json(['message' => 'Subject not found'], 404);
        }

        return response()->json($subject);
    }

    /**
     * Update the specified subject in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $request->validate([
            'subject_name' => 'required|string|max:255|unique:subjects,subject_name,' . $id,
            'subject_short' => 'required|string|max:255|unique:subjects,subject_short,' . $id,
            'subject_sem' => 'required|integer',
        ]);

        $subject = Subjects::find($id);

        if (!$subject) {
            return response()->json(['message' => 'Subject not found'], 404);
        }

        $subject->subject_name = $request->subject_name;
        $subject->subject_short = $request->subject_short;
        $subject->subject_sem = $request->subject_sem;
        $subject->save();

        return response()->json($subject);
    }

    /**
     * Remove the specified subject from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $subject = Subjects::find($id);

        if (!$subject) {
            return response()->json(['message' => 'Subject not found'], 404);
        }

        $subject->delete();

        return response()->json(['message' => 'Subject deleted successfully']);
    }

}
