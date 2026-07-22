// Whitelist of valid TemplateData fields from Prisma schema
// Used to filter out unknown fields before create/update operations
export const VALID_TEMPLATE_DATA_FIELDS = new Set([
  'brideNick', 'groomNick', 'dateText',
  'countdownMaster',
  'coupleTitle', 'coupleSub',
  'groomFull', 'groomRole', 'groomPhoto', 'groomDad', 'groomMom',
  'brideFull', 'brideRole', 'bridePhoto', 'brideDad', 'brideMom',
  'verseText', 'verseSource',
  'storyDate1', 'storyTitle1', 'storyDesc1', 'storyDate2', 'storyTitle2', 'storyDesc2',
  'akadDate', 'akadTime', 'akadPlace',
  'resepsiDate', 'resepsiTime', 'resepsiPlace',
  'gal1', 'gal2', 'gal3', 'gal4', 'gal5', 'gal6',
  'rsvpTitle', 'rsvpDesc',
  'bankName', 'bankAcc', 'bankHolder',
  'streamTitle', 'streamDesc',
  'wishesTitle', 'wishesDesc',
  'heroBg', 'coupleBg', 'storyBg', 'galleryBg', 'giftsBg', 'wishesBg',
  'closingThanks', 'closingFam',
]);
