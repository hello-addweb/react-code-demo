import { InsuranceUpdated } from "../classes/InsuranceUpdate";
import { ProfileUpdated } from "../classes/ProfileUpdate";
import { userEntity } from "./DatabaseDefinitions";
import { DocumentsUpdated } from '../classes/DocumentsUpdate';

export async function updateInsuranceState(InsuranceUpdated: InsuranceUpdated) {
  let item = {
    UserId: InsuranceUpdated.userId,
    InsuranceCount: InsuranceUpdated.insuranceCount,
    InsuranceOplock: InsuranceUpdated.eventTime
  };
  console.log("user item to update");
  console.log(item);
  try {
    await userEntity.update(item, {
      conditions: [
        { exists: false, attr: "InsuranceOplock" },
        { or: true, attr: 'InsuranceOplock', lt: InsuranceUpdated.eventTime }
      ]
    })
  } catch (err) {
    if (err.code !== "ConditionalCheckFailedException") {
      console.log("error occurred while updating insurance");
      console.log(err);
      throw err;
    }
  }
}

export async function updateDocumentsCount(DocumentsUpdated: DocumentsUpdated) {
  let item = {
    UserId: DocumentsUpdated.userID,
    DocumentsCount: DocumentsUpdated.documentsCount,
    DocumentsOplock: DocumentsUpdated.eventTime
  };
  console.log("user item to update");
  console.log(item);
  try {
    await userEntity.update(item, {
      conditions: [
        { exists: false, attr: "DocumentsOplock" },
        { or: true, attr: 'DocumentsOplock', lt: DocumentsUpdated.eventTime }
      ]
    })
  } catch (err) {
    if (err.code !== "ConditionalCheckFailedException") {
      console.log("error occurred while updating insurance");
      console.log(err);
      throw err;
    }
  }
}

export async function updateTimelineExplanationCount(userId: string, timelineExplanationCount: number) {
  let item = {
    UserId: userId,
    TimelineExplanationCount: timelineExplanationCount
  }
  let response = await userEntity.update(item)
}
export async function updateProfileState(ProfileUpdated: ProfileUpdated) {
  let item = {
    UserId: ProfileUpdated.userId,
    SuggestProfileUpdate: ProfileUpdated.suggestProfileUpdate,
    PreferredLanguage: ProfileUpdated.preferredLanguage,
    ProfileOplock: ProfileUpdated.eventTime
  };
  console.log("user item to update");
  console.log(item);
  try {
    await userEntity.update(item, {
      conditions: [
        { exists: false, attr: "ProfileOplock" },
        { or: true, attr: 'ProfileOplock', lt: ProfileUpdated.eventTime }
      ]
    })
  } catch (err) {
    if (err.code !== "ConditionalCheckFailedException") {
      console.log("error occurred while updating insurance");
      console.log(err);
      throw err;
    }
  }
}

export async function getUserInfo(userId: string) {
  let item = {
    UserId: userId,
  }
  let response = await userEntity.get(item)
  return response;
}