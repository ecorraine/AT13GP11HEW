// Fetch the XML file when the page is loaded
// ページがロードされた際に実行
window.onload = function () {
    const path = window.location.pathname;
    // console.log(path);
    const segments = path.split('/');
    
    // Get the second-to-last segment of the URL
    // URLの最後から2番目のセグメントを取得
    const classSegment = segments[segments.length - 2];

    const fileName = path.substring(path.lastIndexOf('/') + 1);
    // console.log(fileName);
    // omit file extension
    // 拡張子を無視
    const file = fileName.substring(0, fileName.lastIndexOf('.'));

    fetch('/AT13/class/' + classSegment + '-details.xml')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to load XML file');
            }
            // Get the text content of the XML file
            // XMLの内容を返す
            return response.text();
        })
        .then(xmlContent => {
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(xmlContent, 'application/xml');

            // Check for errors in XML parsing
            // エラー検査
            const parseError = xmlDoc.querySelector('parsererror');
            if (parseError) {
                throw new Error('Error parsing XML');
            }

            // Extract data from the XML
            // XMLファイルからデータを抽出
            const projectArray = xmlDoc.getElementsByTagName('ProjectDetails');

            let output = '';
            // Iterate through each <ProjectDetails> element using a for loop
            // forループを使用して、各<ProjectDetails>要素を繰り返し処理
            for (let i = 0; i < projectArray.length; i++) {
                let student = projectArray[i];
                // Student Info 学生情報
                let exhibitcode = student.getElementsByTagName('ExhibitCode')[0].textContent;
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
                let img1 = student.getElementsByTagName('Image1')[0].textContent;
                let img2 = student.getElementsByTagName('Image2')[0].textContent;
                let img3 = student.getElementsByTagName('Image3')[0].textContent;
                let img4 = student.getElementsByTagName('Image4')[0].textContent;
                
                // Replace the result on the page
                // 情報を入れ替える
                document.getElementById('class-crumb').href = "/AT13/class/" + shortClassId + ".html";
                document.getElementById('class-crumb').innerHTML = shortClassId + "出展者一覧";
                document.getElementById('student-crumb').innerHTML = exhibitcode;
                document.getElementById('exhibit-code').innerHTML = exhibitcode;
                document.getElementById('exhibit-location').innerHTML = location;
                document.getElementById('student-name').innerHTML = surname + ' ' + firstname;
                document.getElementById('proj-title').innerHTML = projtitle;
                document.getElementById('proj-description').innerHTML = projdesc;
                document.getElementById('proj-video-url').href = videourl;
                document.getElementById('storage-url').href = driveurl;
                document.getElementById('appeal-point').innerHTML = appealtxt;
                document.getElementById('student-profile').innerHTML = profiletxt;
                /*
                document.getElementById('proj-img1').src = convertGoogleDriveURL(img1);
                document.getElementById('proj-img2').src = convertGoogleDriveURL(img2);
                document.getElementById('proj-img3').src = convertGoogleDriveURL(img3);
                document.getElementById('proj-img4').src = convertGoogleDriveURL(img4);
                */
                document.getElementById('proj-img1').src = "/AT13/HEWデータ提出先/" + shortClassId + "/" + exhibitcode +"/image1.png";
                document.getElementById('proj-img2').src = "/AT13/HEWデータ提出先/" + shortClassId + "/" + exhibitcode +"/image2.png";
                document.getElementById('proj-img3').src = "/AT13/HEWデータ提出先/" + shortClassId + "/" + exhibitcode +"/image3.png";
                document.getElementById('proj-img4').src = "/AT13/HEWデータ提出先/" + shortClassId + "/" + exhibitcode +"/image4.png";
            }
        });
};

function convertGoogleDriveURL(url) {
    // Use a regular expression to extract the file ID from the Link A
    const regex = /\/d\/([a-zA-Z0-9-_]+)\//;
    const match = url.match(regex);

    // Check if a match was found
    if (match && match[1]) {
        const fileId = match[1];
        // Construct the Link B using the extracted file ID
        const newURL = `https://drive.google.com/thumbnail?id=${fileId}&sz=w650`;
        return newURL;
    } else {
        // If no match was found, return an error message
        return 'Invalid URL';
    }
}