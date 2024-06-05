import { Router, Request, Response, NextFunction, response } from 'express';
import { Container } from 'typedi';
import middlewares from '../../api/middlewares';
import { celebrate, Joi } from 'celebrate';
import lensChannel from './lensChannel';

const route = Router();

export default (app: Router) => {
  app.use('/showrunners/lens', route);
  // routes for wallet tracker
  route.post(
    '/post',
    celebrate({
      body: Joi.object({
        simulate: [Joi.bool(), Joi.object()],
      }),
    }),
    middlewares.onlyLocalhost,
    async (req: Request, res: Response, next: NextFunction) => {
      const Logger: any = Container.get('logger');
      Logger.debug('Calling /showrunners/wt ticker endpoint with body: %o', req.body);
      try {
        const wt = Container.get(lensChannel);
        const response = await wt.postPublished(req.body.simulate);

        return res.status(201).json({ success: true, data: response });
      } catch (e) {
        Logger.error('🔥 error: %o', e);
        return next(e);
      }
    },
  );

  route.post(
    '/comment',
    celebrate({
      body: Joi.object({
        simulate: [Joi.bool(), Joi.object()],
      }),
    }),
    middlewares.onlyLocalhost,
    async (req: Request, res: Response, next: NextFunction) => {
      const Logger: any = Container.get('logger');
      Logger.debug('Calling /showrunners/wt ticker endpoint with body: %o', req.body);
      try {
        const wt = Container.get(lensChannel);
        const response = await wt.commentPublished(req.body.simulate);

        return res.status(201).json({ success: true, data: response });
      } catch (e) {
        Logger.error('🔥 error: %o', e);
        return next(e);
      }
    },
  );

  route.post(
    '/mirror',
    celebrate({
      body: Joi.object({
        simulate: [Joi.bool(), Joi.object()],
      }),
    }),
    middlewares.onlyLocalhost,
    async (req: Request, res: Response, next: NextFunction) => {
      const Logger: any = Container.get('logger');
      Logger.debug('Calling /showrunners/wt ticker endpoint with body: %o', req.body);
      try {
        const wt = Container.get(lensChannel);
        const response = await wt.mirrorPublished(req.body.simulate);

        return res.status(201).json({ success: true, data: response });
      } catch (e) {
        Logger.error('🔥 error: %o', e);
        return next(e);
      }
    },
  );

  route.post(
    '/quote',
    celebrate({
      body: Joi.object({
        simulate: [Joi.bool(), Joi.object()],
      }),
    }),
    middlewares.onlyLocalhost,
    async (req: Request, res: Response, next: NextFunction) => {
      const Logger: any = Container.get('logger');
      Logger.debug('Calling /showrunners/wt ticker endpoint with body: %o', req.body);
      try {
        const wt = Container.get(lensChannel);
        const response = await wt.quotePublished(req.body.simulate);

        return res.status(201).json({ success: true, data: response });
      } catch (e) {
        Logger.error('🔥 error: %o', e);
        return next(e);
      }
    },
  );

  route.post(
    '/ProfileMentioned',
    celebrate({
      body: Joi.object({
        simulate: [Joi.bool(), Joi.object()],
      }),
    }),
    middlewares.onlyLocalhost,
    async (req: Request, res: Response, next: NextFunction) => {
      const Logger: any = Container.get('logger');
      Logger.debug('Calling /showrunners/wt ticker endpoint with body: %o', req.body);
      try {
        const wt = Container.get(lensChannel);
        const response = await wt.profileMentioned(req.body.simulate);

        return res.status(201).json({ success: true, data: response });
      } catch (e) {
        Logger.error('🔥 error: %o', e);
        return next(e);
      }
    },
  );
    
  route.post(
    '/profileUnfollowed',
    celebrate({
      body: Joi.object({
        simulate: [Joi.bool(), Joi.object()],
      }),
    }),
    middlewares.onlyLocalhost,
    async (req: Request, res: Response, next: NextFunction) => {
      const Logger: any = Container.get('logger');
      Logger.debug('Calling /showrunners/wt ticker endpoint with body: %o', req.body);
      try {
        const wt = Container.get(lensChannel);
        const response = await wt.profileUnFollowed(req.body.simulate);

        return res.status(201).json({ success: true, data: response });
      } catch (e) {
        Logger.error('🔥 error: %o', e);
        return next(e);
      }
    },
  );

  route.post(
    '/profileFollowed',
    celebrate({
      body: Joi.object({
        simulate: [Joi.bool(), Joi.object()],
      }),
    }),
    middlewares.onlyLocalhost,
    async (req: Request, res: Response, next: NextFunction) => {
      const Logger: any = Container.get('logger');
      Logger.debug('Calling /showrunners/wt ticker endpoint with body: %o', req.body);
      try {
        const wt = Container.get(lensChannel);
        const response = await wt.profileFollowed(req.body.simulate);

        return res.status(201).json({ success: true, data: response });
      } catch (e) {
        Logger.error('🔥 error: %o', e);
        return next(e);
      }
    },
  );

  route.post(
    '/PublicationActed',
    celebrate({
      body: Joi.object({
        simulate: [Joi.bool(), Joi.object()],
      }),
    }),
    middlewares.onlyLocalhost,
    async (req: Request, res: Response, next: NextFunction) => {
      const Logger: any = Container.get('logger');
      Logger.debug('Calling /showrunners/wt ticker endpoint with body: %o', req.body);
      try {
        const wt = Container.get(lensChannel);
        const response = await wt.publicationActed(req.body.simulate);

        return res.status(201).json({ success: true, data: response });
      } catch (e) {
        Logger.error('🔥 error: %o', e);
        return next(e);
      }
    },
  );

  route.post(
    '/pubCollected',
    celebrate({
      body: Joi.object({
        simulate: [Joi.bool(), Joi.object()],
      }),
    }),
    middlewares.onlyLocalhost,
    async (req: Request, res: Response, next: NextFunction) => {
      const Logger: any = Container.get('logger');
      Logger.debug('Calling /showrunners/wt ticker endpoint with body: %o', req.body);
      try {
        const wt = Container.get(lensChannel);
        const response = await wt.publicationCollected(req.body.simulate);

        return res.status(201).json({ success: true, data: response });
      } catch (e) {
        Logger.error('🔥 error: %o', e);
        return next(e);
      }
    },
  );
  
};