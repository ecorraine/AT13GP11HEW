// Fetch the XML file when the page is loaded｜ページがロードされた際に実行
window.onload = function () {
    const path = window.location.pathname;
    let pathName = path.substring(path.lastIndexOf('/') + 1);
    // omit file extension｜拡張子を無視
    pathName = pathName.substring(0, pathName.lastIndexOf('.'));
    const classname = pathName.toUpperCase();
    console.log(classname);

    // fetch StudentList XML file｜StudentList XMLファイルを取得
    fetch('/AT13/class/' + classname + '-list.xml')
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

            // fetch ProjectDetails XML file｜ProjectDetails XMLファイルを取得
            return fetch('/AT13/class/' + classname + '-details.xml')
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Failed to load ProjectDetails XML file');
                    }
                    return response.text();
                })
                .then(xmlContent2 => {
                    const xmlProjectDetails = parser.parseFromString(xmlContent2, 'application/xml');
                    const parseError2 = xmlProjectDetails.querySelector('parsererror');
                    if (parseError2) {
                        throw new Error('Error parsing second XML');
                    }

                    // extract data from XMLs｜XMLファイルからデータを抽出
                    PopFromXML(xmlStudentList, xmlProjectDetails);
                });
        })
        .catch(error => {
            document.getElementById('carousel').textContent = 'Error: ' + error.message;
        });
};

// Extract data from the XML｜XMLファイルからデータを抽出
function PopFromXML(xmlList, xmlDetails) {
    const studentArray = xmlList.getElementsByTagName('StudentInfo');
    console.log('Number of students found in XML:', studentArray.length);

    const detailsArray = xmlDetails.getElementsByTagName('ProjectDetails');

    let output = '';
    // Iterate through each <StudentInfo> element using a for loop｜forループを使用して、各<StudentInfo>要素を繰り返し処理
    for (let i = 0; i < studentArray.length; i++) {
        let student = studentArray[i];
        
        let exhibitcode = student.getElementsByTagName('ExhibitCode')[0].textContent;
        
        let classid = student.getElementsByTagName('ClassId')[0].textContent;
        let classno = student.getElementsByTagName('ClassNo')[0].textContent;
        let surname = student.getElementsByTagName('Surname')[0].textContent;
        let firstname = student.getElementsByTagName('FirstName')[0].textContent;
        let surnamepho = student.getElementsByTagName('SurnamePhonetic')[0].textContent;
        let firstnamepho = student.getElementsByTagName('FirstNamePhonetic')[0].textContent;
        let status = student.getElementsByTagName('Status')[0].textContent;
        
        let shortClassId = classid.substring(0, 5);
        
        // Check if status os active and the ExhibitCode matches in both XMLs｜ステータスが1で（'退学'若しくは、'休学'されていない学生であれば）、ExhibitCodeが一致するか確認
        if (status == '1') {
            var details = detailsArray[i];

            if(details && exhibitcode == details.getElementsByTagName('ExhibitCode')[0].textContent) {
                let location = details.getElementsByTagName('Location')[0].textContent;
                let projtitle = details.getElementsByTagName('Title')[0].textContent;
                let thumburl = details.getElementsByTagName('Thumbnail')[0].textContent;
                let projdesc = details.getElementsByTagName('Description')[0].textContent;
                
                // Create HTML for each item｜各アイテムのHTMLを作成
                output += `
                    <div class="carousel-item">
                        <div class="item-label">
                            <div id="label-left">${exhibitcode}</div>
                            <div id="label-right">${surname} ${firstname}(${surnamepho} ${firstnamepho})</div>
                        </div>
                        <div class="item-thumbnail">
                            <a href="/AT13/class/${shortClassId}/${exhibitcode}.html" target="_self">
                                <!-- <img class="StudentThumb" src="https://drive.google.com/thumbnail?id=1jj5Cxb40w6kN62GHhB_L_7r_5lu_QlRA&sz=w500" /> -->
                                <img class="StudentThumb" src="/AT13/HEWデータ提出先/${shortClassId}/${exhibitcode}/image0.png" />
                                <span class="StudentThumbLabel">${exhibitcode} - ${surname} ${firstname}</span>
                            </a>
                        </div>
                        <div class="item-title">
                            <a href="/AT13/class/${shortClassId}/${exhibitcode}.html" target="_self">${projtitle}</a>
                        </div>
                        <div class="item-description"><pre>${projdesc}</pre></div>
                        <div class="item-foot">${location}</div>
                    </div>
                    <div class="carousel-spacer">　　</div>
                `;
            }
            else {
                output += `
                    <div class="carousel-item">
                        <div class="item-label">
                            <div id="label-left">${exhibitcode}</div>
                            <div id="label-right">${surname} ${firstname}(${surnamepho} ${firstnamepho})</div>
                        </div>
                        <div class="item-thumbnail">
                            <a href="/AT13/class/${shortClassId}/${exhibitcode}.html" target="_self">
                                <img class="StudentThumb" src="https://drive.google.com/thumbnail?id=1jj5Cxb40w6kN62GHhB_L_7r_5lu_QlRA&sz=w500" />
                                <span class="StudentThumbLabel">${exhibitcode} - ${surname} ${firstname}</span>
                            </a>
                        </div>
                        <div class="item-title">
                            <a href="/AT13/class/${shortClassId}/${exhibitcode}.html" target="_self">
                                春の息吹、萌黄色（もえぎいろ）の輝き
                            </a>
                        </div>
                        <div class="item-description">
                            <pre style="white-space: pre-wrap;">
空は、さっきまでの雨が嘘のように晴れ渡り、陽光が再び地上に降り注ぐ。
濡れたアスファルトがキラキラと輝き、空気は澄み切っている。
水滴を纏った草木は、まるで宝石のように美しい。ふと見上げれば、空には鮮やかな虹が！
赤、橙、黄、緑、青、藍、紫。七色のアーチが、まるで空に架かる橋のようだ。
雨上がりの澄んだ空気の中で見る虹は、ひときわ美しく、希望に満ち溢れている。この美しい景色を、いつまでも覚えていたい。
                            </pre>
                        </div>
                        <div class="item-foot">12F マシーンルーム</div>
                    </div>
                    <div class="carousel-spacer">　　</div>
                `;
            }
        }
        else {
            console.log('Student', exhibitcode, 'is not active');
        }
    }
    // Display the result on the carousel｜結果をカルーセルに表示
    document.getElementById('carousel').innerHTML = output;
};