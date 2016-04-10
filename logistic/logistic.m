%---------------
% Load the data.
%---------------
data = load('ex2data1.txt');

%----------------------
% Variable declaration.
%----------------------
X = data(:, [1,2]);
y = data(:, 3);

[m, n] = size(X);
X = [ones(m, 1) X];
initial_theta = zeros(n + 1, 1);


%---------------
% Plot the data.
%---------------
function plotData(X,y)
    figure; hold on;

    plot(X(find(y==0), 2), X(find(y==0), 3), 'ko', 'MarkerFaceColor', 'r');
    plot(X(find(y==1), 2), X(find(y==1), 3), 'ko', 'MarkerFaceColor', 'g');

    legend('Admitted', 'Not admitted');
    xlabel('Exam 1 score'); ylabel('Exam 2 score');

    hold off;
end


%----------------------
% The sigmoid function.
%----------------------
function g = sigmoid(z)
    g = 1 ./ ( 1 + e.^(-z) );
end


%--------------------------
% Cost function & gradient.
%--------------------------

function [J, grad] = costFunction(theta, X, y)
  m = length(y);
  J = (1/m) * sum( -y.*log(sigmoid(X*theta)) - (1-y).*log(1 - sigmoid(X*theta) ));
  grad = (1/m) .* ( X' * (sigmoid(X*theta) - y) );
end
