//Public Domain.

var infix_input = "infix_input"
var infix_table = "infix_table"
var infix_err = "error"
var tablehead = '<table id="infix_table" border="1" cellspacing = "0" cellpadding = "5">\
				<tr> <th>Symbol</th> <th>Postfix Stack</th> <th>Oper. Stack</th> </tr>\n'

function prec(oper)
{
	var prec = 0;
	
	switch(oper)
	{
		case '^':
			++prec;
		case '*': case '/':
			++prec;
		case '+': case '-':
			++prec;
	}
	
	return prec;
}

function infixerr(infix, err, n)
{
	var ld = "", rd = "";
	if(n - 10 > 0)
		ld = "...";
	if(n + 10 < infix.length - 1)
		rd = "...";

	ret = "";
	ret += "<h3>Error:</h3>";
	ret += err;
	ret += "<br /> At position " + n + ":<br />";
	ret += "<code>" + ld + infix.slice((n - 10) < 0 ? 0 : n - 10, n) + "<b><u>" + 
		   infix.slice(n, n + 1) + "</b>" + infix.slice(n + 1, n + 10) + rd + "</code>";
	return ret;
}

function infixeval(infix)
{
	var ret = tablehead;
	var err = "";
	var oper = [];
	var postfix = [];
	
	var bracket = 0;
	
	for(var i = 0; i < infix.length; ++i)
	{
		switch(infix[i])
		{
			case '+': case '-': case '*': case '/': case '^':
				while((oper.length - 1 >= 0) && (prec(infix[i]) <= prec(oper[oper.length - 1])))
					postfix.push(oper.pop());

				oper.push(infix[i]);
				break;
			
			case '(':
				++bracket;
				oper.push('(');
				break;
				
			case ')':
				if(bracket == 0)
				{
					ret = " ";
					err = infixerr(infix, "Unmatched closing bracket", i);
					return [ret, err];
				}
				while((oper.length - 1 >= 0) && (oper[oper.length - 1] != '('))
					postfix.push(oper.pop());
				
				oper.pop();
				--bracket;
				break;
			
			case ' ': case '\t': case '\n':
				break;

			default:
				postfix.push(infix[i]);
				break;
		}
		ret += "<tr> <td>" + infix[i] + "</td> <td>" +  postfix.join("") + "</td> <td>" + oper.join("") + "</td> </tr>\n";
	}
	
	while((oper.length - 1 >= 0))
		postfix.push(oper.pop());

	ret += "<tr> <td></td> <td><b>" +  (postfix.join("") == "" ? "<i>nil</i>": postfix.join("")) + "</b></td> <td></td> </tr>";
	ret += "</table>"
	return [ret, err];
}

function updatetable()
{
	var val;
	var infix = document.getElementById(infix_input).value;
	val = infixeval(infix);
	document.getElementById(infix_table).innerHTML = val[0];
	document.getElementById(infix_err).innerHTML = val[1];
}
