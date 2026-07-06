import { NextFunction, Request, Response } from 'express';
import * as bodyService from './body.service';

export async function getBodyComposition(req: Request, res: Response, next: NextFunction) {
  try {
    const entries = await bodyService.findBodyCompositionByUserId(req.session.userId!);
    res.json({ data: entries, error: null });
  } catch (error) {
    next(error);
  }
}

export async function getLatestBodyComposition(req: Request, res: Response, next: NextFunction) {
    try {
        const entry = await bodyService.findLatestBodyCompositionByUserId(req.session.userId!);
        res.json({ data: entry, error: null });
    } catch (error) {
        next(error);
    }
}

export async function postBodyComposition(req: Request, res: Response, next: NextFunction) {
    try {
        const entry = await bodyService.createBodyCompositionEntry(req.session.userId!, req.body);
        res.status(201).json({ data: entry, error: null });
    } catch (error) {
        next(error);
    }
}

export async function putBodyComposition(req: Request, res: Response, next: NextFunction) {
    try {
        const entry = await bodyService.findBodyCompositionEntryById(req.params.id);
        if (!entry || entry.userId !== req.session.userId) {
            return res.status(404).json({ data: null, error: { code: 'NOT_FOUND', message: 'Entry not found' } });
        }
        const updatedEntry = await bodyService.updateBodyCompositionEntry(req.params.id, req.body);
        res.json({ data: updatedEntry, error: null });
    } catch (error) {
        next(error);
    }
}

export async function deleteBodyComposition(req: Request, res: Response, next: NextFunction) {
    try {
        const entry = await bodyService.findBodyCompositionEntryById(req.params.id);
        if (!entry || entry.userId !== req.session.userId) {
            return res.status(404).json({ data: null, error: { code: 'NOT_FOUND', message: 'Entry not found' } });
        }
        await bodyService.deleteBodyCompositionEntry(req.params.id);
        res.status(204).send();
    } catch (error) {
        next(error);
    }
}