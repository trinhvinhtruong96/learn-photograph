const stage = (data) => ({ ...data, path: `/stages/${data.id}.html` });

export const PRACTICE_METHOD =
  'For each task: change one thing at a time. Compare the frames side by side in darktable. Write one line per frame: setting, result, why. Redo your weakest frame the next day.';

export const STAGES = [
  stage({
    id: 'exposure', number: '1', title: 'Exposure: control light', level: 'Beginner', weeks: '1–2', group: 'core',
    summary: 'Learn how aperture, shutter speed and ISO make a photo bright or dark.',
    learn: ['Set up your camera from zero', 'Use stops to compare light', 'Balance aperture, shutter speed and ISO', 'Read the histogram and fix exposure'],
    assignments: [
      { id: 'aperture-ladder', title: 'Aperture ladder', task: 'In A mode, shoot one still subject with the 35mm at f/1.4, 2, 2.8, 4, 5.6, 8, 11 and 16.', check: 'You can point to the frame where the background starts to look sharp.' },
      { id: 'shutter-ladder', title: 'Shutter ladder', task: 'In S mode, shoot moving water or traffic from 1/1000 s down to 1/4 s, one stop at a time.', check: 'You can name the slowest speed that still freezes the motion.' },
      { id: 'iso-test', title: 'ISO test', task: 'In a dim room, shoot one scene at ISO 100, 400, 1600, 6400 and 25600. View each at 100% in darktable.', check: 'You have picked your highest ISO that still looks clean enough to you.' },
      { id: 'histogram-fix', title: 'Fix it with the histogram', task: 'Shoot 30 frames in A mode. After each one, read the histogram and fix the exposure with the exposure compensation dial.', check: 'No important highlights touch the right edge of the histogram.' },
      { id: 'sunny-16', title: 'Sunny 16', task: 'On a sunny day, set M mode, ISO 100, f/16 and 1/125 s without looking at the meter. Then try the cloud and shade steps.', check: 'Your frames are within one stop of a good exposure.' },
    ],
  }),
  stage({
    id: 'focus', number: '2', title: 'Focus and sharpness', level: 'Beginner', weeks: '3', group: 'core',
    summary: 'Get the right part of the photo sharp, every time.',
    learn: ['Pick the right focus mode and area', 'Use Eye AF and back-button focus', 'Control depth of field', 'Find your handheld limit'],
    assignments: [
      { id: 'nearest-eye', title: 'Nearest eye', task: 'With the 85mm at about 2 m, shoot a friend turned slightly to one side at f/1.8 and at f/4. Use Eye AF in AF-S.', check: 'At 100%, the eye closest to you is sharp in both frames.' },
      { id: 'track-walker', title: 'Track a walker', task: 'Set AF-C. Ask a friend to walk toward you and shoot a burst of 10 frames.', check: 'At least 7 of the 10 frames are sharp on the face.' },
      { id: 'handheld-limit', title: 'Your handheld limit', task: 'Shoot a still object with each lens from 1/60 s down to 1/4 s, three frames per speed.', check: 'You know your slowest sharp speed for the 35mm and for the 85mm.' },
      { id: 'manual-peaking', title: 'Manual focus with peaking', task: 'Set Peaking Level to Mid. Focus 10 still objects in Manual Focus.', check: '8 of the 10 frames are sharp where you wanted.' },
    ],
  }),
  stage({
    id: 'composition', number: '3', title: 'Composition', level: 'Intermediate', weeks: '4–5', group: 'core',
    summary: 'Arrange what is in the frame so the photo is clear and strong.',
    learn: ['Simplify the frame', 'Use thirds, lines, frames and layers', 'Control perspective with distance', 'Work a scene'],
    assignments: [
      { id: 'twenty-ways', title: '20 compositions', task: 'Pick one subject. Make 20 different photos of it in 20 minutes: move, crouch, climb, change the background.', check: 'You can pick 3 frames that each work for a different reason.' },
      { id: 'lens-swap', title: '35mm vs 85mm', task: 'Frame a person from head to waist with the 35mm. Then walk back and make the same framing with the 85mm.', check: 'You can describe how the background changed.' },
      { id: 'lines-walk', title: 'Leading lines walk', task: 'For one walk, only shoot photos where a line leads to the subject.', check: 'You have 5 frames where the line ends at the subject.' },
      { id: 'three-heights', title: 'Three heights', task: 'Shoot one scene from ground level, eye level and from above.', check: 'You can say which height tells the story best, and why.' },
    ],
  }),
  stage({
    id: 'light', number: '4', title: 'Light and color', level: 'Intermediate', weeks: '6–7', group: 'core',
    summary: 'See light like a photographer and get color right.',
    learn: ['See hard and soft light', 'Use light direction on faces', 'Plan for golden and blue hour', 'Set white balance'],
    assignments: [
      { id: 'four-times', title: 'Four times of day', task: 'Shoot the same place at sunrise, midday, golden hour and blue hour.', check: 'You can describe the shadows and the color in each frame.' },
      { id: 'window-turn', title: 'Turn by the window', task: 'Put a person next to a window. Shoot them facing it, then turned to 45°, 90°, 135° and 180°.', check: 'You can name the light direction you like best for faces.' },
      { id: 'wb-sunset', title: 'White balance at sunset', task: 'At sunset, shoot one scene with Auto, Daylight and Shade white balance.', check: 'You can explain why Shade looks the warmest.' },
      { id: 'complementary', title: 'Complementary colors', task: 'Find and shoot 5 scenes with orange against blue, or red against green.', check: 'In each frame the two colors are easy to spot.' },
    ],
  }),
  stage({
    id: 'editing', number: '5', title: 'Editing workflow (darktable)', level: 'Intermediate', weeks: '8', group: 'core',
    summary: 'Turn RAW files into finished photos in darktable.',
    learn: ['Organize and cull a shoot', 'Edit a RAW file in a set order', 'Edit a whole set at once', 'Export and back up'],
    assignments: [
      { id: 'cull-ten', title: 'Cull to 10', task: 'Import one shoot with add to library. Reject weak frames with R, then give stars until 10 frames have 3 stars or more.', check: 'You have exactly 10 picks.' },
      { id: 'edit-ten', title: 'Edit 10 in order', task: 'Edit your 10 picks in the working order from this stage. Take a snapshot before you start each one.', check: 'Every edit looks better than its snapshot to you.' },
      { id: 'export-web', title: 'Export a web set', task: 'Export the 10 as JPEG, sRGB, quality 90, max size 2048 × 2048.', check: 'All 10 files open on your phone and look like they do on the computer.' },
      { id: 'backup-321', title: 'Back up', task: 'Set up the 3-2-1 rule: your computer, an external drive and one copy off-site. Include the .xmp files.', check: 'You can find one photo on all 3 copies.' },
    ],
  }),
  stage({
    id: 'advanced-editing', number: '6', title: 'Advanced editing (darktable and GIMP)', level: 'Advanced', weeks: '9–10', group: 'core',
    summary: 'Edit parts of a photo, grade color and retouch in darktable and GIMP.',
    learn: ['Edit parts of a photo with masks', 'Dodge, burn and shape contrast', 'Grade color and build a style', 'Retouch skin and spots in GIMP'],
    assignments: [
      { id: 'graduated-sky', title: 'Graduated sky', task: 'Darken the sky in a landscape with a gradient mask in exposure.', check: 'You cannot see where the mask ends.' },
      { id: 'portrait-retouch', title: 'Portrait retouch', task: 'In GIMP, remove 5 blemishes with Heal and even out the skin with Wavelet decompose.', check: 'At 100%, pores and skin texture are still visible.' },
      { id: 'set-style', title: 'One style, six frames', task: 'Create a style from your best edit and apply it to a 6-frame set.', check: 'The 6 frames look like one series.' },
      { id: 'hdr-merge', title: 'HDR merge', task: 'Shoot a 3-frame bracket on a tripod and merge it with create HDR.', check: 'Both the bright sky and the dark shadows show detail.' },
    ],
  }),
  stage({
    id: 'portrait', number: '7a', title: 'Portrait (85mm)', level: 'Advanced', weeks: '11', group: 'track',
    summary: 'Make flattering portraits with the 85mm.',
    learn: ['Choose distance and settings for portraits', 'Separate the person from the background', 'Find flattering light', 'Direct people with actions'],
    assignments: [
      { id: 'five-frame-set', title: 'Five-frame portrait set', task: 'Photograph one person: tight, waist-up, full body, environmental with the 35mm, and one candid.', check: 'The 5 frames work together as one story about this person.' },
      { id: 'three-lights', title: 'Three light setups', task: 'Shoot the same person in open shade, by a window at 45°, and backlit with a reflector.', check: 'You can say which setup flatters this face most.' },
      { id: 'direct-actions', title: 'Direct with actions', task: 'Direct a friend through 5 actions: walk, turn, look away, laugh, sit. Do not give poses.', check: 'At least 3 frames look natural, not posed.' },
    ],
  }),
  stage({
    id: 'street', number: '7b', title: 'Street and documentary (35mm)', level: 'Advanced', weeks: '12', group: 'track',
    summary: 'Catch real moments and tell stories with the 35mm.',
    learn: ['Zone focus with the 35mm', 'See light, layers and gestures', 'Work ethically and legally', 'Tell a story in a photo essay'],
    assignments: [
      { id: 'one-hour-theme', title: 'One hour, one theme', task: 'Walk for one hour with only the 35mm. Pick one theme, such as hands or shadows.', check: 'You have 5 frames on the theme.' },
      { id: 'fishing', title: 'Fishing', task: 'Find good light and a clean background. Wait 20 minutes in that spot for the right person to walk in.', check: 'One frame has a person in the exact spot you chose.' },
      { id: 'photo-essay', title: 'Photo essay', task: 'Shoot an 8-photo story about one place or event: establishing, medium, detail, portrait, moment, closing.', check: 'Someone who was not there can tell you the story from the 8 photos.' },
    ],
  }),
  stage({
    id: 'landscape', number: '7c', title: 'Landscape and travel', level: 'Advanced', weeks: '13', group: 'track',
    summary: 'Plan, shoot and share places with depth and good light.',
    learn: ['Plan for light and weather', 'Get front-to-back sharpness', 'Shoot long exposures and brackets', 'Tell a travel story'],
    assignments: [
      { id: 'golden-plan', title: 'Plan a golden hour', task: 'Use SunCalc.org to plan one sunrise or sunset shoot. Arrive 30 minutes early.', check: 'You were set up before the best light started.' },
      { id: 'long-exposure', title: 'Long exposure', task: 'Use a tripod and an ND filter, or blue hour, to shoot moving water or clouds for 1 s or longer.', check: 'The moving parts look smooth and the still parts are sharp.' },
      { id: 'travel-story', title: 'Travel story', task: 'Make a 6-frame travel story: wide view, people, detail, food, transport, night.', check: 'The 6 frames show a place, not only its sights.' },
    ],
  }),
  stage({
    id: 'night', number: '7d', title: 'Night and low light', level: 'Advanced', weeks: '14', group: 'track',
    summary: 'Shoot sharp, clean photos when light is low.',
    learn: ['Shoot sharp photos handheld at night', 'Choose noise over blur', 'Shoot light trails and city lights', 'Try your first star photo'],
    assignments: [
      { id: 'night-street', title: 'Handheld night street', task: 'Shoot 20 frames on a lit street, handheld, with the 35mm at f/1.4.', check: 'At least 10 frames are sharp at 100%.' },
      { id: 'light-trails', title: 'Light trails', task: 'At blue hour, put the camera on a tripod. Shoot traffic at ISO 100, f/8 to f/11, for 5 to 30 s.', check: 'The trails are long and no light turns into a big white blob.' },
      { id: 'first-stars', title: 'First star photo', task: 'On a moonless night away from city light, shoot the stars with the 35mm at the NPF time.', check: 'Stars look like dots, not lines, at 100%.' },
    ],
  }),
  stage({
    id: 'your-eye', number: '8', title: 'Your own eye and portfolio', level: 'Advanced', weeks: '15–16', group: 'final',
    summary: 'Develop your own style and build a portfolio.',
    learn: ['Learn from the masters', 'Read and critique photos', 'Build a 12-photo portfolio', 'Print and share your work'],
    assignments: [
      { id: 'study-three', title: 'Study three masters', task: 'Pick 3 photos by the masters on this page. For each, write what you see, how it was made and what it means.', check: 'You wrote at least 3 sentences per photo.' },
      { id: 'portfolio-12', title: 'Build a 12-photo portfolio', task: 'Choose your best 12 photos. Give them one consistent edit and put them in a sequence.', check: 'Every photo earns its place; you would remove none.' },
      { id: 'feedback-three', title: 'Get feedback', task: 'Show your portfolio to 3 people. Ask which photo stays with them and which one they would remove.', check: 'You changed at least one thing because of the feedback.' },
      { id: 'print-five', title: 'Print five', task: 'Print 5 photos at least 13 × 18 cm.', check: 'The prints look as good as the screen version.' },
    ],
  }),
];

export function getStage(id) {
  return STAGES.find((s) => s.id === id);
}

export function stageNeighbors(id) {
  const index = STAGES.findIndex((s) => s.id === id);
  if (index < 0) return { prev: null, next: null };
  return {
    prev: index > 0 ? STAGES[index - 1] : null,
    next: index < STAGES.length - 1 ? STAGES[index + 1] : null,
  };
}

export function weeksLabel(weeks) {
  return weeks.includes('–') ? `Weeks ${weeks}` : `Week ${weeks}`;
}
