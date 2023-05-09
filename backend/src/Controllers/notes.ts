import { RequestHandler } from "express";
import createHttpError from "http-errors";
import mongoose from "mongoose";
import NoteModel from "../models/note"

export const getNotes: RequestHandler = async (req,res,next)=> {
    try{
        const notes = await NoteModel.find().exec();

        res.status(200).json(notes);
    }catch(error){
       next(error);
    }
};

export const getNote: RequestHandler = async (req,res,next)=> {
    try{
        const noteId = req.params.noteId;

        if(!mongoose.isValidObjectId(noteId)){
            throw createHttpError(400, "Invalid Note Id");
        }

        const note = await NoteModel.findById(noteId).exec();

        if(!note){
            throw createHttpError(404,"Note not found")
        }

        res.status(200).json(note);
    }catch(error){
       next(error);
    }
};

interface CreateNoteBody{
    title?: string,
    text?:string,
}
export const createNote: RequestHandler<unknown,unknown,CreateNoteBody,unknown> = async (req,res,next) => {
    try{
        const title = req.body.title;
        const text = req.body.text;

        if(!title){
            throw createHttpError(400, "Note must have a title");
        }

        const newNote = await NoteModel.create({
            title: title,
            text: text,
        });
        res.status(201).json(newNote);
    }catch(error){
        next(error);
    }
};

interface UpdateNoteParams{
    noteId: string,
}

interface UpdateNoteBody{
    title?: string,
    text?:string,
}
export const updateNote: RequestHandler<UpdateNoteParams,unknown,UpdateNoteBody,unknown> = async (req,res,next) =>{
    
    try{
        const noteId = req.params.noteId;
        const newTitle = req.body.title;
        const newText = req.body.text;

        if(!mongoose.isValidObjectId(noteId)){
            throw createHttpError(400, "Invalid Note Id");
        }

        if(!newTitle){
            throw createHttpError(400, "Note must have a title");
        }

        const note = await NoteModel.findById(noteId).exec();

        if(!note){
            throw createHttpError(404,"Note not found");
        }

        note.title = newTitle;
        note.text = newText;

        const updateNote = await note.save();

        res.status(200).json(updateNote);
    }catch(error){
        next(error);
    }
};


export const deleteNote: RequestHandler = async (req,res,next) =>{
    const noteId = req.params.noteId;

    try{
        if(!mongoose.isValidObjectId(noteId)){
            throw createHttpError(400, "Invalid Note Id");
        }

        const note = await NoteModel.findById(noteId).exec();

        if(!note){
            throw createHttpError(404,"Note not found");
        }

        await note.deleteOne();

        res.sendStatus(204);
    }catch(error){

        next(error);
    }
};