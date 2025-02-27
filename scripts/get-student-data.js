const currentYear = new Date().getFullYear();
const path = window.location.pathname;
// Get the second-to-last segment of the URL｜URLの最後から2番目のセグメントを取得
let segments = path.split('/');
const classSegment = segments[segments.length - 2];

var file = path.substring(path.lastIndexOf('/') + 1);
// omit file extension｜拡張子を無視
const currentFile = file.substring(0, file.lastIndexOf('.'));

// Fetch the XML file when the page is loaded｜ページがロードされた際に実行
window.onload = function () {
    console.log(classSegment);
    // console.log(currentFile);

    // Create the promises for fetching and parsing XML files in parallel｜XMLファイルを取得して解析するためのプロミスを並列で作成
    // fetch StudentList XML file｜StudentList XMLファイルを取得
    const studentListXMLPromise = fetch('/AT13GP11HEW/class/' + currentYear + '/' + classSegment + '-list.xml')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to load StudentList XML file');
            }
            return response.text();
        })
        .then(xmlContent1 => {
            const parser = new DOMParser();
            const xmlStudentList = parser.parseFromString(xmlContent1, 'application/xml');
            const parseError1 = xmlStudentList.querySelector('parsererror');
            if (parseError1) {
                throw new Error('Error parsing XML');
            }
            return xmlStudentList;
        });

    const projectDetailsXMLPromise = fetch('/AT13GP11HEW/class/' + currentYear + '/' + classSegment + '-details.xml')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to load ProjectDetails XML file');
            }
            return response.text();
        })
        .then(xmlContent2 => {
            const parser = new DOMParser();
            const xmlProjectDetails = parser.parseFromString(xmlContent2, 'application/xml');
            const parseError2 = xmlProjectDetails.querySelector('parsererror');
            if (parseError2) {
                throw new Error('Error parsing second XML');
            }
            return xmlProjectDetails;
        });

    // Use Promise.all to run both fetch operations in parallel
    Promise.all([studentListXMLPromise, projectDetailsXMLPromise])
        .then(([xmlStudentList, xmlProjectDetails]) => {
            // extract data from XMLs｜XMLファイルからデータを抽出
            RetrieveFromXML(xmlStudentList, xmlProjectDetails);
        })
        .catch(error => {
            alert('Error: ' + error.message);
        });
};

function RetrieveFromXML(xmlList, xmlDetails) {
    document.getElementById('class-crumb').href = "/AT13GP11HEW/class/" + classSegment + ".html";
    document.getElementById('class-crumb').innerHTML = classSegment + "出展者一覧";

    // Extract data from the XML｜XMLファイルからデータを抽出
    const exhibitschedule = xmlList.getElementsByTagName('ExhibitSchedule')[0].textContent;
    document.getElementById('exhibit-sched').innerHTML = exhibitschedule;

    const projectArray = xmlDetails.getElementsByTagName('ProjectDetails');

    let found = false;
    // Iterate through each <ProjectDetails> element using a for loop｜forループを使用して、各<ProjectDetails>要素を繰り返し処理
    for (let i = 0; i < projectArray.length && !found; i++) {
        let studentdata = projectArray[i];

        // Student Info 学生情報
        let exhibitcode = studentdata.getElementsByTagName('ExhibitCode')[0].textContent;
        let classid = studentdata.getElementsByTagName('ClassId')[0].textContent;
        let classno = studentdata.getElementsByTagName('ClassNo')[0].textContent;
        if (classno == currentFile) {
            console.log('Exhibit Code:', exhibitcode + ' found.');
            let surname = studentdata.getElementsByTagName('Surname')[0].textContent;
            let firstname = studentdata.getElementsByTagName('FirstName')[0].textContent;
            let location = studentdata.getElementsByTagName('Location')[0].textContent;
            // let surnamepho = student.getElementsByTagName('SurnamePhonetic')[0].textContent;
            // let firstnamepho = student.getElementsByTagName('FirstNamePhonetic')[0].textContent;

            let shortClassId = classid.substring(0, 5);

            // Project Contents 作品内容
            let projtitle = studentdata.getElementsByTagName('Title')[0].textContent;
            // let thumburl = student.getElementsByTagName('Thumbnail')[0].textContent;
            let projdesc = studentdata.getElementsByTagName('Description')[0].textContent;
            let videourl = studentdata.getElementsByTagName('Video')[0].textContent;
            let driveurl = studentdata.getElementsByTagName('GDriveURL')[0].textContent;
            let appealtxt = studentdata.getElementsByTagName('AppealPoint')[0].textContent;
            let profiletxt = studentdata.getElementsByTagName('Profile')[0].textContent;
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
                if (studentdata.getElementsByTagName('Image' + j)[0].textContent != "") {
                    document.getElementById('proj-img' + j).src = generateThumbnailURL(studentdata.getElementsByTagName('Image' + j)[0].textContent);
                    // console.log('Image' + j + ': ' + studentdata.getElementsByTagName('Image'+j)[0].textContent);
                }
                else {
                    document.getElementById('proj-img' + j).src = "/AT13GP11HEW/media/sampleimage.png";
                }
            }

            found = true;
        }
        /*
        else {
            // Replace the result on the page｜ページに結果を表示
            document.getElementById('student-crumb').innerHTML = "XX9999";
            document.getElementById('exhibit-code').innerHTML = "XX9999";
            document.getElementById('exhibit-location').innerHTML = "未定";
            document.getElementById('student-name').innerHTML = "大阪" + ' ' + "春太郎";
            document.getElementById('proj-title').innerHTML = "未定";
            document.getElementById('proj-description').innerHTML = `<pre style="white-space: pre-wrap;">未定</pre>`;
            document.getElementById('proj-video-url').href = '';
            document.getElementById('storage-url').href = '';
            document.getElementById('appeal-point').innerHTML = `<pre style="white-space: pre-wrap;">未定</pre>`;
            document.getElementById('student-profile').innerHTML = `<pre style="white-space: pre-wrap;">未定</pre>`;

            for (let j = 1; j < 5; j++) {
                document.getElementById('proj-img' + j).src = "/AT13GP11HEW/media/sampleimage.png";
            }
        }
        */
    }
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
    else {
        // If no match was found, return an error message
        console.log('Invalid Thumbnail URL: ' + url);
        return '#';
    }
}