import { CreateUserParams, SignInParams } from "@/type";
import { Account, Avatars, Client, Databases, ID, Query, Storage } from "react-native-appwrite";

export const appwriteConfig = {
   endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!,
   projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!,
   platform: "com.django.foodordering",
   databaseId: process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!,
   bucketId: process.env.EXPO_PUBLIC_APPWRITE_BUCKET_ID!,
   userCollectionId: process.env.EXPO_PUBLIC_APPWRITE_USER_COLLECTION_ID!,
   menusCollectionId: process.env.EXPO_PUBLIC_APPWRITE_MENU_COLLECTION_ID!,
   customizationsCollectionId: process.env.EXPO_PUBLIC_APPWRITE_CUSTOMIZATION_COLLECTION_ID!,
   categoriesCollectionId: process.env.EXPO_PUBLIC_APPWRITE_CATEGORY_COLLECTION_ID!,
   menuCustomizationsCollectionId: process.env.EXPO_PUBLIC_APPWRITE_MENU_CUSTOMIZATION_COLLECTION_ID!,
}

export const client = new Client();

client
   .setEndpoint(appwriteConfig.endpoint)
   .setProject(appwriteConfig.projectId)
   .setPlatform(appwriteConfig.platform)

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
const avatars = new Avatars(client);

export const createUser = async ({ email, password, name }: CreateUserParams) => {
   try {
      const newAccount = await account.create(ID.unique(), email, password, name);
      if (!newAccount) throw new Error;

      await signIn({ email, password });

      const avatarURL = avatars.getInitialsURL(name);

      return await databases.createDocument(
         appwriteConfig.databaseId,
         appwriteConfig.userCollectionId,
         ID.unique(),
         { accountId: newAccount.$id, email, name, avatar: avatarURL }
      );
   } catch (e) {
      throw new Error(e as string);
   }
}

export const signIn = async ({ email, password }: SignInParams) => {
   try {
      const session = await account.createEmailPasswordSession(email, password);
   } catch (e) {
      throw new Error(e as string);
   }
}

export const signOut = async () => {
   try {
      await account.deleteSession('current');
   } catch (e) {
      throw new Error(e as string);
   }
}

export const getCurrentUser = async () => {
   try {
      const currentAccount = await account.get();
      if (!currentAccount) throw new Error("No user is logged in");
      const currentUser = await databases.listDocuments(
         appwriteConfig.databaseId,
         appwriteConfig.userCollectionId,
         [Query.equal('accountId', currentAccount.$id)]
      );
      if (!currentUser) throw new Error("User not found in database");
      return currentUser.documents[0];
   } catch (e) {
      console.log(e);
      throw new Error(e as string);
   }
}