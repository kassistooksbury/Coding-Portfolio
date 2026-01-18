const icons = require('react-icons/si');

const importedIcons = [
  'SiReact', 'SiNextdotjs', 'SiTypescript', 'SiTailwindcss',
  'SiJavascript', 'SiHtml5', 'SiCss3', 'SiSass', 'SiJava',
  'SiNodedotjs', 'SiPython', 'SiExpress', 'SiMongodb',
  'SiGit', 'SiGithub', 'SiVisualstudiocode', 'SiDocker',
  'SiFirebase', 'SiLinux'
];

importedIcons.forEach(iconName => {
  if (!icons[iconName]) {
    console.log('UNDEFINED ICON:', iconName);
  } else {
    console.log('OK:', iconName);
  }
});
