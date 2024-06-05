import { Inject, Service } from 'typedi';
import { Logger } from 'winston';
import config from '../../config';
import settings from './lensSettings.json';
import { EPNSChannel } from '../../helpers/epnschannel';
import keys from './lensKeys.json';
import { PushAPI, CONSTANTS } from '@pushprotocol/restapi';
import { ethers } from 'ethers';
import axios from 'axios';
import { lensClient } from './client';

const NETWORK_TO_MONITOR = config.web3MainnetNetwork;


@Service()
export default class LensChannel extends EPNSChannel {
  model: any;
  constructor(@Inject('logger') public logger: Logger, @Inject('cached') public cached) {
    super(logger, {
      networkToMonitor: config.web3MainnetNetwork,
      dirname: __dirname,
      name: 'Lens',
      url: 'https://lens.xyz/',
      useOffChain: true,
      address: '0x7398cb2b2D92c34Eabab9da56F0bB23E790204ee',
      isPolygon: true,
    });
  }

  /**
   * The method responsible for responding to all API CALLS to the webhook;
   */
  public async handler(payload: any, simulate: any) {
    const { Message } = payload;
    // @dev change Message || JSON.parse(Message); to JSON.parse(Message); after testing
    let { type, data } = JSON.parse(Message);
    console.log(type, data);
    const messageMeta = settings[type];
    if (!messageMeta) {
      return; //console.log(`${type} is not currently supported`);
    }
    try {
      if (type === 'POST_CREATED') {
        const { pubId, postParams: { profileId } } = data;
        const publication = await lensClient.publication.fetch({
            forId: pubId
        })
        const { by: { handle }} = publication;
        const title = 'New post';
        const body = `New post created by ${handle}`;
        
      } else if (type === 'COMMENT_CREATED') {
      } else if (type === 'MIRROR_CREATED') {
      } else if (type === 'QUOTE_CREATED') {
      } else if (type === 'PROFILE_MENTIONED') {

      } else if (type === 'PUBLICATION_ACTED') {
      } else if (type === 'PUBLICATION_REACTION_ADDED') {
      } else if (type === 'PROFILE_FOLLOWED') {
      } else if (type === 'PROFILE_UNFOLLOWED') {
      } else {
        console.log('Event not supported yet.');
      }
      //   const verifiedPayload = await this._verifyPayload(notifPayload);
      // //   other if/else conditions for other types of notifications
      //   if (!verifiedPayload) return {};
      //   const response = await this.sendNotification(verifiedPayload);
    //   return { data: response, message: 'successfull' };
    } catch (err) {
      console.log('\n\n\n');
      console.log({ err, type, data });
      console.log('\n\n\n');
    }
  }

  public async postPublished(payload: any) {
    console.log(payload)
    let profileId = payload.logicOverride.profileId;
    let pubId = payload.logicOverride.pubIdPointed;

    let url = `https://hey.xyz/posts/${profileId}-${pubId}`
    let result
    try {
        result = await lensClient.publication.fetch({
            forId: pubId
          });
      console.log(result);

    } catch(e) {
        console.log(e.message);
    }

    const { by : { ownedBy: { address } }} = result

    let message = `🌿 Your post was published. Click here to view the post! 🌿`
    let title = 'Your post was published 🥳';
    this.sendNotificationHelper(title,message, address, url);
  }

  public async commentPublished(payload: any) {
    console.log(payload)
    let profileId = payload.logicOverride.profileId;
    let pubId = payload.logicOverride.pubIdPointed;

    let url = `https://hey.xyz/posts/${profileId}-${pubId}` // change to comment addr, not post addr
    let result

    try {
        result = await lensClient.publication.fetch({
            forId: pubId
          });
      console.log(result);

    } catch(e) {
        console.log(e.message);
    }

    const { by: { handle : { localName } } } = result;

    const { root: { by : { ownerBy: { address } } } } = result

    let message = `🌿 <span color='#008101'>${localName}</span> commented on your post. Click here to view the comment!🌿 `
    let title = 'Someone commented on your post 👀'
    this.sendNotificationHelper(title,message, address, url);
  }

  public async mirrorPublished(payload: any) {
    console.log(payload)
    let profileId = payload.logicOverride.profileId;
    let pubId = payload.logicOverride.pubIdPointed;

    let url = `https://hey.xyz/posts/${profileId}-${pubId}` // change to mirror addr, not post addr
    let result

    try {
        result = await lensClient.publication.fetch({
            forId: pubId
          });
      console.log(result);

    } catch(e) {
        console.log(e.message);
    }

    const { by: { handle : { localName } } } = result;

    const { mirrorOn: { by: { ownerBy: { address } } } } = result

    let message = `🌿<span color='#008101'>${localName}</span> mirrored your post. Click here to view the mirror!🌿`
    let title = 'Someone mirrored your post 👀'
    this.sendNotificationHelper(title,message, address, url);
  }

  public async quotePublished(payload: any) {
    console.log(payload)
    let profileId = payload.logicOverride.profileId;
    let pubId = payload.logicOverride.pubIdPointed;

    let url = `https://hey.xyz/posts/${profileId}-${pubId}` // change to quote addr, not post addr
    let result

    try {
        result = await lensClient.publication.fetch({
            forId: pubId
          });
      console.log(result);

    } catch(e) {
        console.log(e.message);
    }

    const { by: { handle : { localName } } } = result;
    const { quoteOn: { by: { ownerBy: { address } } } } = result
    
    let message = `🌿 <span color='#008101'>${localName}</span> quoted your post. Click here to view the quote!🌿 `
    let title = 'Someone quoted your post 👀'
    this.sendNotificationHelper(title,message, address, url);
  }

  public async profileMentioned(payload:any){
    console.log(payload);
    let profileId = payload.logicOverride.profileId;
    let profileIdMentioned = payload.logicOverride.profileIdPointed;
    let pubId = payload.logicOverride.pubIdPointed;

    const profileById = await lensClient.profile.fetch({
      forProfileId: profileId,
    })
    
    const profileByIdMentioned = await lensClient.profile.fetch({
      forProfileId: profileIdMentioned,
    })

    
    let handle = await profileByIdMentioned?.handle;
    console.log(handle?.localName);

    let ownerAddress = await profileById?.ownedBy.address;
    let url = `https://hey.xyz/posts/${pubId}`

    let message = `🌿 You have been mentioned by <span color='green'>${handle?.localName}</span> in a post. Click here to view the post! 🌿`
    let title = 'Someone Mentioned you in a post 👀';
    this.sendNotificationHelper(title,message, ownerAddress,url);
  }

   public async publicationActed(payload:any){
    console.log(payload);
    let publicationActedProfileId = payload.logicOverride.publicationActionParams.publicationActedProfileId;
    let actorProfileId = payload.logicOverride.publicationActionParams.actorProfileId;
    let publicationActedId = payload.logicOverride.publicationActionParams.publicationActedId;
    let action = payload.logicOverride.publicationActionParams.actionModuleData;

    const publicationActedProfileIdById = await lensClient.profile.fetch({
      forProfileId: publicationActedProfileId,
    })
    
    const actorProfileIdById = await lensClient.profile.fetch({
      forProfileId: actorProfileId,
    })

    
    let handle = await actorProfileIdById?.handle;
    console.log(handle?.localName);

    let ownerAddress = await publicationActedProfileIdById?.ownedBy.address;
    let url = `https://hey.xyz/posts/${publicationActedId}`

    if(action == 'Upvote'){
    let message = `🌿 <span color='green'>${handle?.localName}</span> has Liked 👍 your post ! Click here to view the post! 🌿`
    let title = `Someone Liked 👍 your post 👀`;
    this.sendNotificationHelper(title,message, ownerAddress,url);

    }else{
      let message = `🌿 <span color='green'>${handle?.localName}</span> has disliked👎 your post ! Click here to view the post! 🌿`
      let title = `Someone disliked👎 yourpost 👀`;
    this.sendNotificationHelper(title,message, ownerAddress,url);

    }
  } 

  public async publicationCollected(payload:any){
    console.log(payload);
    let collectedProfileId = payload.logicOverride.collectedProfileId;
    let collectedPubId = payload.logicOverride.collectedPubId;
    let collectorProfileId = payload.logicOverride.collectorProfileId;

    console.log("collectedProfileId",collectedProfileId);
    const collectedProfileIdById = await lensClient.profile.fetch({
      forProfileId: collectedProfileId,
    })
    console.log("collectedProfileIdById",collectedProfileIdById);
    const collectorProfileIdById = await lensClient.profile.fetch({
      forProfileId: collectorProfileId,
    })
    console.log("collectorProfileIdById",collectorProfileIdById);

    let handle = await collectorProfileIdById?.handle;
    console.log(handle?.localName);

    let ownerAddress = await collectedProfileIdById?.ownedBy.address;

    let url = `https://hey.xyz/posts/${collectedPubId}`

    let message = `🌿 <span color='green'>${handle?.localName}</span> have collected your post. Click here to view the post! 🌿`
    let title = 'Someone collected your post 👀';
    this.sendNotificationHelper(title,message, ownerAddress,url);
  }

/*     public async publicationReactionAdded(payload:any){
    console.log(payload);
    let profileId = payload.logicOverride.profileId;
    let serverPubId = payload.logicOverride.serverPubId;
    let action = payload.type;

    const profileIdById = await lensClient.profile.fetch({
      forProfileId: profileId,
    })
    
    const actorProfileIdById = await lensClient.profile.fetch({
      forProfileId: actorProfileId,
    })

    
    let handle = await actorProfileIdById?.handle;
    console.log(handle?.localName);

    let ownerAddress = await publicationActedProfileIdById?.ownedBy.address;
    let url = `https://hey.xyz/posts/${publicationActedId}`

    if(action == 'upvote'){
    let message = `🌿 <span color='green'>${handle?.localName}</span> has Liked 👍 your post !. Click here to view the post! 🌿`
    let title = `Someone Liked 👍 your post 👀`;
    this.sendNotificationHelper(title,message, ownerAddress,url);

    }else{
      let message = `🌿 <span color='green'>${handle?.localName}</span> has disliked👎 your post !. Click here to view the post! 🌿`
      let title = `Someone disliked👎 yourpost 👀`;
    this.sendNotificationHelper(title,message, ownerAddress,url);

    }
  } */
  public async profileFollowed(payload:any){
    console.log(payload);
    let followerProfileId = payload.logicOverride.followerProfileId;
    let idOfProfileFollowed = payload.logicOverride.idOfProfileFollowed;

    const idOfProfileFollowedById = await lensClient.profile.fetch({
      forProfileId: idOfProfileFollowed,
    })
    
    const followerProfileIdById = await lensClient.profile.fetch({
      forProfileId: followerProfileId,
    })

    
    let handle = await followerProfileIdById?.handle;
    console.log(handle?.localName);

    let ownerAddress = await idOfProfileFollowedById?.ownedBy.address;
    let url = `https://hey.xyz/u/${handle?.localName}`

    let message = `🌿 You have been Followed by <span color='green'>${handle?.localName}</span>. Click here to view the profile! 🌿`
    let title = 'Someone followed you on lens 👀';
    this.sendNotificationHelper(title,message, ownerAddress,url);
  }

  public async profileUnFollowed(payload:any){
    console.log(payload);
    let unfollowerProfileId = payload.logicOverride.unfollowerProfileId;
    let idOfProfileUnfollowed = payload.logicOverride.idOfProfileUnfollowed;

    const idOfProfileUnfollowedById = await lensClient.profile.fetch({
      forProfileId: idOfProfileUnfollowed,
    })
    
    const unfollowerProfileIdById = await lensClient.profile.fetch({
      forProfileId: unfollowerProfileId,
    })

    
    let handle = await unfollowerProfileIdById?.handle;
    console.log(handle?.localName);

    let ownerAddress = await idOfProfileUnfollowedById?.ownedBy.address;
    let url = `https://hey.xyz/u/${handle?.localName}`

    let message = `🌿 You have been Un-Followed by <span color='red'>${handle?.localName}</span>. Click here to view the profile! 🌿`
    let title = 'Someone Un-followed you on lens 👀';
    this.sendNotificationHelper(title,message, ownerAddress,url);
  }

  public async sendNotificationHelper(title,message,ownerAddress:string,url){ {
    const provider = new ethers.providers.JsonRpcProvider(settings.providerUrl);
    const signer = new ethers.Wallet(keys.PRIVATE_KEY_NEW_STANDARD.PK, provider);
    const userAlice = await PushAPI.initialize(signer, { env: CONSTANTS.ENV.STAGING });
    message = message + `[timestamp: ${Math.floor(Date.now() / 1000)}]`;
    const sendNotifRes = await userAlice.channel.send([ownerAddress], {
      notification: { title: 'Lens Notification', body: 'Theres some Activity going on your lens' },
      payload: { title: title, body: message, cta: url },
      channel: '0xae8689B3711F27B640bA4dbC5bF65398dbE28016',
    });
  }
}
}