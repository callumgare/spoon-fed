import { hash } from "ohash";
import { Cache } from "../cache/client";
import type { Paprika } from "../paprika/client";
import type { Recipe } from "../paprika/types";
import { getExpiresInFromUrl } from "../utils/s3";
import { pictureDetailsSchema, type PictureDetails } from "./types";

const recipePictureMap = new Cache();

export async function useProxiedPictureUrls(recipe: Recipe): Promise<Recipe> {
  const modifiedRecipe = {...recipe}
  if (modifiedRecipe.image_url) {
    modifiedRecipe.image_url = await cachePictureUrl(
      modifiedRecipe.image_url,
      {
        recipeId: modifiedRecipe.uid,
        pictureType: "image",
        pictureHash: hash(modifiedRecipe.image_url),
      }
    )
  }

  if (modifiedRecipe.photo_url) {
    modifiedRecipe.photo_url = await cachePictureUrl(
      modifiedRecipe.photo_url,
      {
        recipeId: modifiedRecipe.uid,
        pictureType: "photo",
        pictureHash: modifiedRecipe.photo_hash ?? modifiedRecipe.hash,
      }
    )
  }

  modifiedRecipe.hash = `${modifiedRecipe.hash}-with-cached-pictures`

  return modifiedRecipe
}

async function cachePictureUrl(pictureUrl: string, pictureDetails: PictureDetails): Promise<string> {
  let cacheTtl = 1000 * 60 * 60 * 24 * 30 // Set the default expiry date to 30 days in the future
  const urlExpiresIn = getExpiresInFromUrl(pictureUrl || "")
  if (typeof urlExpiresIn === "number") {
    cacheTtl = urlExpiresIn - (1000 * 5) // If the url indicates an expiry then use that minus 5 seconds
  }
  const pictureKey = pictureDetailsToKey(pictureDetails)
  logger.info(`Setting ${pictureDetails.pictureType} for ${pictureDetails.recipeId} to ${pictureUrl} with a TTL of ${cacheTtl/1000} seconds using the key ${pictureKey}`)
  await recipePictureMap.set(pictureKey, pictureUrl, {cacheTtl})
  return pictureDetailsToUrl(pictureDetails)
}

export async function getUpstreamPictureUrl(spoonFeedPictureUrl: string, paprika: Paprika) {
  const pictureDetails = urlToPictureDetails(spoonFeedPictureUrl)
  const pictureKey = pictureDetailsToKey(pictureDetails)

  let upstreamPictureUrl = await recipePictureMap.get(pictureKey)
  if (!upstreamPictureUrl) {
    logger.info(`The ${pictureDetails.pictureType} url for recipe ${pictureDetails.recipeId} with cache key ${pictureKey} is not cached, fetching the recipe to get the url`)
    const recipe = await paprika.recipe(pictureDetails.recipeId);
    // Call useProxiedPictureUrls() to save any picture urls into the map
    await useProxiedPictureUrls(recipe)
    if (pictureDetails.pictureType === "image") {
      upstreamPictureUrl = recipe.image_url
    } else if (pictureDetails.pictureType === "photo") {
      upstreamPictureUrl = recipe.photo_url
    } else {
      pictureDetails.pictureType satisfies never
    }
    if (!upstreamPictureUrl) {
      logger.info("Recipe:")
      logger.info(recipe)
      logger.error(`Failed to retrieve ${pictureDetails.pictureType} from original recipe ${recipe.uid} using key ${pictureKey}`)
    }
  }

  if (!upstreamPictureUrl) {
    return null
  }
  return upstreamPictureUrl
}

const basePicturePath = '/api/paprika/recipe/picture'

function pictureDetailsToUrl(pictureDetails: PictureDetails): string {
  const searchParams = new URLSearchParams(pictureDetails)
  return `${basePicturePath}?${searchParams}`
}

function urlToPictureDetails(pictureUrl: string): PictureDetails {
  // URL() will throw an error if the first arg is only a path with no domain
  // so we provide a valid domain in the second argument to allow a path to be
  // used in the first
  const url = new URL(pictureUrl, "http://unused.domain")
  const pictureDetails = Object.fromEntries(url.searchParams.entries()) 
  return pictureDetailsSchema.parse(pictureDetails)

}

function pictureDetailsToKey(pictureDetails: PictureDetails): string {
  const {recipeId, pictureType, pictureHash } = pictureDetails
  return `${recipeId}:${pictureType}:${pictureHash}`

}