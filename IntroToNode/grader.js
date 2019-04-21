function average(grades){
    var sum = 0;
    for(var i = 0; i < grades.length; i++){
        sum += grades[i];
    }
    return Math.round(sum/grades.length);
};

var scores = [90,98,89,100,100,86,94];
console.log(average(scores));

