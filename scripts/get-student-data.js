// Fetch the XML file when the page is loaded｜ページがロードされた際に実行
window.onload = function () {
    const path = window.location.pathname;
    let segments = path.split('/');
    // Get the second-to-last segment of the URL｜URLの最後から2番目のセグメントを取得
    const classSegment = segments[segments.length - 2];

    var file = path.substring(path.lastIndexOf('/') + 1);
    // omit file extension｜拡張子を無視
    const currentFile = file.substring(0, file.lastIndexOf('.'));
    console.log(currentFile);

    fetch('/AT13GP11HEW/class/2025/' + classSegment + '-details.xml')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to load XML file');
            }
            return response.text();
        })
        .then(xmlContent => {
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(xmlContent, 'application/xml');

            const parseError = xmlDoc.querySelector('parsererror');
            if (parseError) {
                throw new Error('Error parsing XML');
            }

            document.getElementById('class-crumb').href = "/AT13GP11HEW/class/" + classSegment + ".html";
            document.getElementById('class-crumb').innerHTML = classSegment + "出展者一覧";

            // Extract data from the XML｜XMLファイルからデータを抽出
            const projectArray = xmlDoc.getElementsByTagName('ProjectDetails');
            // Iterate through each <ProjectDetails> element using a for loop｜forループを使用して、各<ProjectDetails>要素を繰り返し処理
            for (let i = 0; i < projectArray.length; i++) {
                let student = projectArray[i];
                
                let exhibitcode = student.getElementsByTagName('ExhibitCode')[0].textContent;
                if (exhibitcode == currentFile) {
                    console.log('Exhibit Code:', exhibitcode + ' found');
                    // Student Info 学生情報
                    let location = student.getElementsByTagName('Location')[0].textContent;
                    let classid = student.getElementsByTagName('ClassId')[0].textContent;
                    let classno = student.getElementsByTagName('ClassNo')[0].textContent;
                    let surname = student.getElementsByTagName('Surname')[0].textContent;
                    let firstname = student.getElementsByTagName('FirstName')[0].textContent;
                    // let surnamepho = student.getElementsByTagName('SurnamePhonetic')[0].textContent;
                    // let firstnamepho = student.getElementsByTagName('FirstNamePhonetic')[0].textContent;

                    let shortClassId = classid.substring(0, 5);

                    // Project Contents 作品内容
                    let projtitle = student.getElementsByTagName('Title')[0].textContent;
                    // let thumburl = student.getElementsByTagName('Thumbnail')[0].textContent;
                    let projdesc = student.getElementsByTagName('Description')[0].textContent;
                    let videourl = student.getElementsByTagName('Video')[0].textContent;
                    let driveurl = student.getElementsByTagName('GDriveURL')[0].textContent;
                    let appealtxt = student.getElementsByTagName('AppealPoint')[0].textContent;
                    let profiletxt = student.getElementsByTagName('Profile')[0].textContent;
                    /*
                    let img1 = student.getElementsByTagName('Image1')[0].textContent;
                    let img2 = student.getElementsByTagName('Image2')[0].textContent;
                    let img3 = student.getElementsByTagName('Image3')[0].textContent;
                    let img4 = student.getElementsByTagName('Image4')[0].textContent;
                    */

                    // Replace the result on the page｜ページに結果を表示
                    document.getElementById('class-crumb').href = "/AT13GP11HEW/class/" + shortClassId + ".html";
                    document.getElementById('class-crumb').innerHTML = shortClassId + "出展者一覧";
                    document.getElementById('student-crumb').innerHTML = exhibitcode;
                    document.getElementById('exhibit-code').innerHTML = exhibitcode;
                    document.getElementById('exhibit-location').innerHTML = location;
                    document.getElementById('student-name').innerHTML = surname + ' ' + firstname;
                    document.getElementById('proj-title').innerHTML = projtitle;
                    document.getElementById('proj-description').innerHTML = `<pre style="white-space: pre-wrap;">` + projdesc + `</pre>`;
                    document.getElementById('proj-video-url').href = videourl;
                    document.getElementById('storage-url').href = driveurl;
                    document.getElementById('appeal-point').innerHTML = `<pre style="white-space: pre-wrap;">` + appealtxt + `</pre>`;
                    document.getElementById('student-profile').innerHTML = `<pre style="white-space: pre-wrap;">` + profiletxt + `</pre>`;

                    for (let j = 1; j < 5; j++) {
                        if (student.getElementsByTagName('Image'+j)[0].textContent != "") {
                            document.getElementById('proj-img'+j).src = generateThumbnailURL(student.getElementsByTagName('Image'+j)[0].textContent);
                            // console.log('Image' + j + ': ' + student.getElementsByTagName('Image'+j)[0].textContent);
                        }
                        else {
                            document.getElementById('proj-img'+j).src = "/AT13GP11HEW/media/sampleimage.png";
                        }
                    }
                    /*
                    document.getElementById('proj-img1').src = "/AT13/HEWデータ提出先/" + shortClassId + "/" + exhibitcode +"/image1.png";
                    document.getElementById('proj-img2').src = "/AT13/HEWデータ提出先/" + shortClassId + "/" + exhibitcode +"/image2.png";
                    document.getElementById('proj-img3').src = "/AT13/HEWデータ提出先/" + shortClassId + "/" + exhibitcode +"/image3.png";
                    document.getElementById('proj-img4').src = "/AT13/HEWデータ提出先/" + shortClassId + "/" + exhibitcode +"/image4.png";
                    */
                }
                else {
                    // Replace the result on the page｜ページに結果を表示
                    document.getElementById('student-crumb').innerHTML = "XX9999";
                    document.getElementById('exhibit-code').innerHTML = "XX9999";
                    document.getElementById('exhibit-location').innerHTML = "未定";
                    document.getElementById('student-name').innerHTML = "大阪" + ' ' + "春太郎";
                    document.getElementById('proj-title').innerHTML = "春の息吹、萌黄色（もえぎいろ）の輝き";
                    document.getElementById('proj-description').innerHTML = `<pre style="white-space: pre-wrap;">
空は、さっきまでの雨が嘘のように晴れ渡り、陽光が再び地上に降り注ぐ。
濡れたアスファルトがキラキラと輝き、空気は澄み切っている。
水滴を纏った草木は、まるで宝石のように美しい。ふと見上げれば、空には鮮やかな虹が！
赤、橙、黄、緑、青、藍、紫。七色のアーチが、まるで空に架かる橋のようだ。
雨上がりの澄んだ空気の中で見る虹は、ひときわ美しく、希望に満ち溢れている。この美しい景色を、いつまでも覚えていたい。</pre>`;
                    document.getElementById('proj-video-url').href = '';
                    document.getElementById('storage-url').href = '';
                    document.getElementById('appeal-point').innerHTML = `<pre style="white-space: pre-wrap;">
空は、さっきまでの雨が嘘のように晴れ渡り、陽光が再び地上に降り注ぐ。
濡れたアスファルトがキラキラと輝き、空気は澄み切っている。
水滴を纏った草木は、まるで宝石のように美しい。ふと見上げれば、空には鮮やかな虹が！
赤、橙、黄、緑、青、藍、紫。七色のアーチが、まるで空に架かる橋のようだ。
雨上がりの澄んだ空気の中で見る虹は、ひときわ美しく、希望に満ち溢れている。この美しい景色を、いつまでも覚えていたい。</pre>`;
                    document.getElementById('student-profile').innerHTML = `<pre style="white-space: pre-wrap;">
空は、さっきまでの雨が嘘のように晴れ渡り、陽光が再び地上に降り注ぐ。
濡れたアスファルトがキラキラと輝き、空気は澄み切っている。
水滴を纏った草木は、まるで宝石のように美しい。ふと見上げれば、空には鮮やかな虹が！
赤、橙、黄、緑、青、藍、紫。七色のアーチが、まるで空に架かる橋のようだ。
雨上がりの澄んだ空気の中で見る虹は、ひときわ美しく、希望に満ち溢れている。この美しい景色を、いつまでも覚えていたい。</pre>`;

                    for (let j = 1; j < 5; j++) {
                        document.getElementById('proj-img' + j).src = "/AT13GP11HEW/media/sampleimage.png";
                    }
                }
            }
        });
};

function generateThumbnailURL(url) {
    // Use a regular expression to extract the file ID from the Link A
    const regex = /\/d\/([a-zA-Z0-9-_]+)\//;
    const match = url.match(regex);

    // Check if a match was found
    if (match && match[1]) {
        const fileId = match[1];
        // Construct the Link B using the extracted file ID
        const newURL = `https://drive.google.com/thumbnail?id=${fileId}&sz=w650`;
        return newURL;
    }
    /*
    else {
        // If no match was found, return an error message
        return 'Invalid URL';
    }
    */
}