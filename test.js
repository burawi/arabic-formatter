var arabicFormatter = require('./')

var text = 'هذا نص عربي يجب أن يعدّل';
var text = 'ـ الولادة على الفطرة ـ مصير من مات طفلا';
// var text = 'عربي';

var formattedText = arabicFormatter.format(text, true);

console.log(formattedText);

