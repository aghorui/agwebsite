//Public Domain.

var tablehead = '<tr> <th>Symbol</th> <th>Postfix Stack</th> <th>Oper. Stack</th> </tr>\n'

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

function infixeval(infix)
{
	var ret = tablehead;
	var oper = [];
	var postfix = [];
	for(var i = 0; i < infix.length; ++i)
	{
		switch(infix[i])
		{
			case '+': case '-': case '*': case '/': case '^':
				while((oper.length - 1 >= 0) && (prec(infix[i]) <= prec(oper[oper.length - 1])))
				{
					postfix.push(oper.pop());
				}
				oper.push(infix[i]);
				break;
			
			case '(':
				oper.push('(');
				break;
				
			case ')':
				while((oper.length - 1 >= 0) && (oper[oper.length - 1] != '('))
				{
					postfix.push(oper.pop());
				}
				oper.pop();
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
	ret += "<tr> <td></td> <td><b>" +  postfix.join("") + "</b></td> <td></td> </tr>\n";
	return ret;
}

function updatetable()
{
	infix = document.getElementById("infix_input").value;
	document.getElementById("infix").innerHTML = infixeval(infix);
}
